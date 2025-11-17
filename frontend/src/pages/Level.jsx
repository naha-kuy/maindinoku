// Level.jsx
import React, { useEffect, useState, useRef } from 'react'
import apiClient from '../utils/axios'
import EggHatch from '../components/EggHatch'
import { motion } from 'framer-motion'

const LOCAL_NAME_KEY = 'dinoname_map_v1'

function readLocalNameMapForPlayer(playerId) {
  try {
    const raw = localStorage.getItem(LOCAL_NAME_KEY)
    if (!raw) return {}
    const all = JSON.parse(raw)
    const isFlat =
      Object.keys(all || {}).length > 0 &&
      Object.values(all).every((v) => typeof v === 'string')
    if (playerId && isFlat && !all[playerId]) {
      const migrated = { [playerId]: all }
      localStorage.setItem(LOCAL_NAME_KEY, JSON.stringify(migrated))
      return migrated[playerId] || {}
    }
    return (all && all[playerId]) ? all[playerId] : {}
  } catch (e) {
    console.error('readLocalNameMapForPlayer error', e)
    return {}
  }
}

function writeLocalNameMapForPlayer(playerId, mapForPlayer) {
  try {
    const raw = localStorage.getItem(LOCAL_NAME_KEY)
    const all = raw ? JSON.parse(raw) : {}
    all[playerId] = mapForPlayer || {}
    localStorage.setItem(LOCAL_NAME_KEY, JSON.stringify(all))
  } catch (e) {
    console.error('writeLocalNameMapForPlayer error', e)
  }
}

export default function Level({ player, levelNumber, onFinish, onBack }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState({})
  const [time, setTime] = useState(180)
  const timerRef = useRef(null)

  const [statusMsg, setStatusMsg] = useState('')
  const [showHatch, setShowHatch] = useState(false)
  const [pendingDino, setPendingDino] = useState(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [dinoNameInput, setDinoNameInput] = useState('')
  const [recommendedName, setRecommendedName] = useState("");
  const [dinoImageUrl, setDinoImageUrl] = useState('')
  const [savingDino, setSavingDino] = useState(false)

  const [feedback, setFeedback] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [waitingNext, setWaitingNext] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [attemptCount, setAttemptCount] = useState(0) // berapa kali sudah mencoba soal sekarang
  const [answersSummary, setAnswersSummary] = useState([]) // rekap jawaban tiap soal
  const [showSummary, setShowSummary] = useState(false) // flag untuk tampilkan halaman rekap akhir
  const [showBadge, setShowBadge] = useState(false) // modal singkat "Hebat!" setelah selesai level
 

  useEffect(() => {
    if (!player) {
      setStatusMsg('Yuk isi nama kamu dulu di halaman utama!')
      return
    }
    setStatusMsg('')
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, levelNumber])

  // ---------------------- ADD HELPER & SAFETY REDIRECT HERE ----------------------

  // helper: pastikan player sudah menyelesaikan semua level sebelumnya
  function playerHasCompleted(p, lvl) {
    if (!p) return false;
    if (lvl === 1) return true;
    const levels = p.levels || [];
    for (let i = 1; i < lvl; i++) {
      const found = levels.find(
        (l) => Number(l.level_number) === i
      );
      // jika level tidak ada, anggap dilewati (bukan kegagalan)
      if (!found) continue;
      if (found.status !== "completed") return false;
    }
    return true;
  }

  // safety redirect: bila pemain mencoba membuka level yang belum unlocked
  useEffect(() => {
    if (!player) return
    const ok = playerHasCompleted(player, levelNumber)
    if (!ok) {
      setStatusMsg('Selesaikan level sebelumnya dulu untuk membuka level ini.')
      // beri sedikit jeda supaya pemain melihat pesan lalu kembali
      const t = setTimeout(() => {
        if (onBack) onBack()
      }, 1100)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, levelNumber])

  //misal ada route lama yang nyasar ke Level 3, otomatis kembali ke home dan tidak crash.
  useEffect(() => {
    if (Number(levelNumber) === 3) {
      setStatusMsg('Level 3 tidak tersedia.')
      const t = setTimeout(() => onBack && onBack(), 1200)
      return () => clearTimeout(t)
    }
  }, [levelNumber, onBack])

  // -------------------------------------------------------------------------------
  useEffect(() => {
    if (questions.length > 0) resetTimer()
    return () => clearInterval(timerRef.current)
  }, [currentQuestionIndex, questions])

  function resetTimer() {
    clearInterval(timerRef.current)
    setTime(180)
    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setFeedback('Waktu habis! Jawaban salah.')
          handleWrongAnswerTimeout()
          setWaitingNext(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function fetchQuestions() {
    try {
      const res = await apiClient.get(`/api/questions/${player.id}/${levelNumber}`);
      setQuestions(res.data);
      setCorrectCount(0); // reset setiap kali level dimulai
      setAnswersSummary([]) // reset rekap tiap level
      setCurrentQuestionIndex(0)
    } catch (e) {
      setStatusMsg('Gagal ambil soal');
      console.error('fetchQuestions error', e);
    }
  }

  function resetAnswer() {
    if (levelNumber === 4) {
      setAnswer({ number1: '', number2: '', operation: '×', final_answer: '' })
    } else {
      setAnswer({ final_answer: '' })
    }
  }

  useEffect(() => {
    resetAnswer()
    setAttemptCount(0) // reset attempt tiap soal baru
  }, [currentQuestionIndex])

  // ---------------------- submitAnswer: LOGIKA 3X PERCObaan ----------------------
  async function submitAnswer() {
    if (submitting) return
    const q = questions[currentQuestionIndex]
    if (!q) return

    setSubmitting(true)
    let payload = {}
    if (levelNumber === 1 || levelNumber === 2) {
      payload = { number1: q.number1, number2: q.number2, operation: q.operation, final_answer: answer.final_answer }

    } else if (levelNumber === 4) {
      payload = { number1: answer.number1, number2: answer.number2, operation: answer.operation, final_answer: answer.final_answer }
    }

    try {
      const res = await apiClient.post('/api/answer', {
        player_id: player.id,
        question_id: q.id,
        level: levelNumber,
        answer_payload: payload,
        time_spent: 180 - time,
      })

      clearInterval(timerRef.current)

      if (res.data.isCorrect) {
        // => JIKA BENAR
        setAttemptCount(0) // reset percobaan
        setCorrectCount((c) => c + 1)
        setFeedback('Jawaban benar! klik "lanjut" untuk menuju ke soal berikutnya!')

        // simpan rekap jawaban (benar)
        setAnswersSummary((prev) => [
          ...prev,
          {
            question: q.question_text,
            userAnswer: answer.final_answer,
            correctAnswer: q.correct_answer || '',
            isCorrect: true,
            attempts: attemptCount + 1,
            timeSpent: 180 - time
          }
        ])

        if (res.data.obtainedDino) {
          setPendingDino(res.data.obtainedDino)
          setShowHatch(true)

          const obtained = res.data.obtainedDino || {}
          const dispatched = { ...obtained, player_id: player?.id ?? obtained.player_id }
          try {
            window.dispatchEvent(new CustomEvent('dinoAdded', { detail: dispatched }))
          } catch (e) {
            console.warn('dispatch dinoAdded failed', e)
          }
        } else {
          setWaitingNext(true)
        }

      } else {
        // => JIKA SALAH
        const newAttempt = attemptCount + 1
        setAttemptCount(newAttempt)

        if (newAttempt < 3) {
          // beri kesempatan mencoba lagi (belum habis 3x)
          setFeedback(`Jawaban salah! Kesempatan tersisa ${3 - newAttempt} kali. Coba lagi ya!`)
          // jangan tambahkan ke rekap sampai percobaan habis atau benar
        } else {
          // habis 3x -> tampilkan pembenaran dan simpan rekap
          setFeedback(`Sayang sekali. Jawaban benar adalah: ${q.correct_answer || ''}`)
          setAnswersSummary((prev) => [
            ...prev,
            {
              question: q.question_text,
              userAnswer: answer.final_answer,
              correctAnswer: q.correct_answer || '',
              isCorrect: false,
              attempts: newAttempt,
              timeSpent: 180 - time
            }
          ])
          setAttemptCount(0)
          setWaitingNext(true)
        }
      }
    } catch (e) {
      setStatusMsg('Gagal submit jawaban')
      console.error('submitAnswer error', e)
    } finally {
      setSubmitting(false)
    }
  }
  // ketika waktu habis, masukkan rekap dengan indikator waktu habis
  function handleWrongAnswerTimeout() {
    const q = questions[currentQuestionIndex]
    if (!q) return
    setAnswersSummary((prev) => [
      ...prev,
      {
        question: q.question_text,
        userAnswer: '(Waktu habis)',
        correctAnswer: q.correct_answer || '',
        isCorrect: false,
        attempts: attemptCount,
        timeSpent: 180
      }
    ])
    setAttemptCount(0)
    setWaitingNext(true)
  }
  function goNextQuestion() {
    setFeedback('')
    setWaitingNext(false)
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      finishLevel()
    }
  }

  async function finishLevel() {
    try {
      const fin = await apiClient.post('/api/finish-level', {
        player_id: player.id,
        level: levelNumber,
        obtained_correct_count: correctCount,
        time_spent: questions.length * 180 - time,
      });

      // tampilkan badge singkat (visual gamifikasi tambahan)
      setShowBadge(true)
      setTimeout(() => {
        setShowBadge(false)
        // setelah badge hilang, tampilkan rekap hasil (lokal di client)
        setShowSummary(true)
      }, 1800)

      // perbarui player di parent bila server mengembalikan data player/levels
      if (fin.data.player && fin.data.levels) {
        // catatan: onFinish mungkin mengharapkan struktur tertentu di Home.jsx
        if (onFinish) onFinish({ ...fin.data.player, levels: fin.data.levels })
      } else if (fin.data.player) {
        if (onFinish) onFinish(fin.data.player)
      } else {
        if (onFinish) onFinish(player)
      }
    } catch (e) {
      setStatusMsg('Gagal submit hasil level');
      console.error('finishLevel error', e);
    }
  }

  function guessDinoImage(dino) {
    if (!dino) return '/assets/images/dino_default.png'
    if (dino.image) return dino.image
    const slug = (dino.dino_type || 'dino').toLowerCase().replace(/\s+/g, '_')
    return `/assets/images/${slug}.png`
  }

  async function saveDinoToServerOrLocal(dinoObj, chosenName) {
    const playerId = String(player?.id ?? 'guest')
    try {
      // Note: /api/save-dino endpoint doesn't exist, so we'll just save to localStorage
      // If you need to save to server, create the endpoint first
      const existing = readLocalNameMapForPlayer(playerId)
      const updated = { ...existing, [dinoObj.id]: chosenName }
      writeLocalNameMapForPlayer(playerId, updated)

      window.dispatchEvent(new CustomEvent('dinoAdded', { detail: { ...dinoObj, dino_name: chosenName, player_id: playerId } }))
    } catch (e) {
      console.error('saveDinoToServerOrLocal failed', e)
    }
  }

  async function handleSaveName(chosenName) {
    if (!pendingDino) return
    setSavingDino(true)
    await saveDinoToServerOrLocal(pendingDino, chosenName)
    setSavingDino(false)
    setShowNameModal(false)
    setPendingDino(null)
    setWaitingNext(true)
  }

  // === Render UI ===
  if (statusMsg && statusMsg === 'Yuk isi nama kamu dulu di  halaman utama!') {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto bg-white/90 rounded p-6 flex flex-col gap-4">
          <div className="text-lg font-medium">{statusMsg}</div>
          <div className="mt-4">
            <button className="btn-jw" onClick={() => onBack && onBack()}>
              ⬅ Kembali ke Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showHatch && pendingDino) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-4 sm:p-6">
          <h3 className="font-bold text-center text-lg sm:text-xl mb-3">
            Selamat jawaban kamu benar! Klik telur untuk menetaskannya!
          </h3>
          <div className="flex justify-center">
            <EggHatch
              images={[
                '/assets/images/egg_1.png',
                '/assets/images/egg_2.png',
                '/assets/images/egg_3.png',
                '/assets/images/egg_4.png',
              ]}
              onHatched={() => {
                setShowHatch(false)
                const suggested =
                  pendingDino?.dino_name && pendingDino.dino_name.trim() !== ''
                    ? pendingDino.dino_name
                    : pendingDino.dino_type +
                      '-' +
                      Math.floor(Math.random() * 9000 + 1000)
                setRecommendedName(suggested)
                setDinoNameInput("")
                setDinoImageUrl(guessDinoImage(pendingDino))
                setShowNameModal(true)
              }}
              imgClassName="w-full h-auto object-contain max-h-48 sm:max-h-64"
            />
          </div>
        </div>
      </div>
    )
  }

  if (showNameModal && pendingDino) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
          <h3 className="text-xl font-bold mb-4">
              yey kamu dapat dino baru  🥳🎉 yuk kasih nama dinonya!
          </h3>
          <div className="mb-4">
            <img
              src={dinoImageUrl}
              alt={pendingDino.dino_type}
              className="mx-auto max-h-32 w-auto"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/dino_default.png'
              }}
            />
            <div className="mt-3 font-semibold">Jenis dino: {pendingDino.dino_type}</div>
          </div>

          <div className="mb-4">
            <input
              value={dinoNameInput}
              onChange={(e) => {
                // batasi panjang input di sisi client
                const v = e.target.value;
                const max = 10; // ubah angka ini kalau mau lebih pendek/panjang
                if (v.length > max) {
                  setDinoNameInput(v.slice(0, max));
                } else {
                  setDinoNameInput(v);
                }
              }}
              className="w-full border p-2 rounded"
              placeholder="Masukkan nama dinosaurus (10 max)"
              disabled={savingDino}
              maxLength={20}
            />
          </div>

          <div className="flex gap-2 justify-center">
            <button
              className="btn-jw"
              disabled={savingDino}
              onClick={() =>
                handleSaveName(
                  dinoNameInput.trim() !== "" ? dinoNameInput.trim() : recommendedName
                )
              }
            >
              {savingDino ? 'Menyimpan...' : 'Simpan'}
            </button>

            <button
              className="btn-next"
              disabled={savingDino}
              onClick={() =>
                handleSaveName(
                  dinoNameInput ||
                    pendingDino.dino_type +
                      '-' +
                      Math.floor(Math.random() * 9000 + 1000)
                )
              }
            >
              {savingDino ? 'Menyimpan...' : 'Lewati'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // jika pemain belum input nama -> tampilkan instruksi dan tombol kembali ke home
  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/90 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Hai, sepertinya kamu belum masuk!</h3>
          <p className="text-sm text-gray-700 mb-4">
            Silakan kembali ke halaman utama dan masukkan nama untuk memulai petualangan.
          </p>

          <div className="flex justify-center gap-2">
            <button
              onClick={onBack}
              className="btn-jw"
              aria-label="Kembali ke beranda"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>

        {/* Tombol Kembali (fixed) — opsional, biar mudah diakses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="fixed bottom-4 left-4"
        >
          <button onClick={onBack} className="btn-jw text-xs sm:text-sm">
            ↩
          </button>
        </motion.div>
      </div>
    )
  }

  // jika player ada tapi soal belum dimuat
  if (questions.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>Sepertinya kamu sudah memainkan level ini😔</p>
        <button 
          onClick={onBack} 
          className="btn-jw mt-4 text-xs sm:text-sm"
        >
          ↩ Kembali
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen flex items-start justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl sm:max-w-3xl bg-white/90 rounded-lg p-4 sm:p-6">
        {/* header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">
              Soal:
            </h3>
            <div className="text-sm text-gray-600">
              {currentQuestionIndex + 1} dari {questions.length}
            </div>

            {/* Progress bar sederhana (revisi: tambahan gamifikasi visual non-intrusive) */}
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div
                className="bg-green-500 h-2 rounded"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                }}
              />
            </div>

          </div>
          <div className="ml-auto inline-flex items-center gap-3">
            <div className="px-3 py-2 bg-white rounded shadow text-sm font-semibold border">
              {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* question card */}
        <div className="mt-4 p-4 bg-green-50 rounded space-y-3 font-poppins">
          <div className="font-semibold text-base sm:text-lg">
            {currentQ.question_text}
          </div>

          {currentQ.question_image && (
            <div className="mt-2 flex justify-center">
              <img
                src={currentQ.question_image}
                alt="Gambar soal"
                className="max-h-48 w-auto"
                onError={(e) => {
                  e.currentTarget.src = '/assets/images/dino_default.png'
                }}
              />
            </div>
          )}

          {/* inputs */}
          {(levelNumber === 1 || levelNumber === 2) && (
            <input
              className="border p-2 rounded mt-2 w-full"
              placeholder="Jawaban akhir"
              value={answer.final_answer || ''}
              onChange={(e) =>
                setAnswer((a) => ({ ...a, final_answer: e.target.value }))
              }
              disabled={waitingNext || submitting}
            />
          )}

          {levelNumber === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <input
                className="border p-2 rounded w-full"
                placeholder="Angka 1"
                value={answer.number1 || ''}
                onChange={(e) =>
                  setAnswer((a) => ({ ...a, number1: e.target.value }))
                }
                disabled={waitingNext || submitting}
              />
              <select
                className="border p-2 rounded w-full"
                value={answer.operation || '×'}
                onChange={(e) =>
                  setAnswer((a) => ({ ...a, operation: e.target.value }))
                }
                disabled={waitingNext || submitting}
              >
                <option>×</option>
                <option>÷</option>
              </select>
              <input
                className="border p-2 rounded w-full"
                placeholder="Angka 2"
                value={answer.number2 || ''}
                onChange={(e) =>
                  setAnswer((a) => ({ ...a, number2: e.target.value }))
                }
                disabled={waitingNext || submitting}
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Jawaban akhir"
                value={answer.final_answer || ''}
                onChange={(e) =>
                  setAnswer((a) => ({ ...a, final_answer: e.target.value }))
                }
                disabled={waitingNext || submitting}
              />
            </div>
          )}
        </div>

        {feedback && (
          <div className="mt-4 p-3 bg-yellow-100 text-yellow-900 rounded text-sm">
            {feedback}
          </div>
        )}

        {/* actions */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          {!waitingNext && (
            <button
              className="btn-jw w-full sm:w-auto"
              onClick={submitAnswer}
              disabled={submitting}
            >
              {submitting ? 'Mengirim...' : 'Kirim Jawaban'}
            </button>
          )}
          {waitingNext && (
            <button className="btn-next w-full sm:w-auto" onClick={goNextQuestion}>
              Lanjut
            </button>
          )}
          <div className="sm:flex-1" />
          <button className="btn-jw w-full sm:w-auto" onClick={() => onBack && onBack()}>
            ⬅ Kembali
          </button>
        </div>
      </div>
    </div>
  )
}
