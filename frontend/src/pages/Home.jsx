import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AudioPlayer from "../components/AudioPlayer";
import apiClient from "../utils/axios";
import Level from "./Level";
import Dinoku from "./Dinoku";

export default function Home({ player, setPlayer, onBack, onGoLatihan }) {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState([]);
  const [view, setView] = useState("main");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [clueLevel, setClueLevel] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // status/toast
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info");
  const statusTimerRef = useRef(null);

    // Judul clue berbeda tiap level
  const clueTitles = {
    1: "Halo petualang!",
    2: "Pernah berpikir bagaimana cara berbagi adil? 🪺",
    4: "Waktunya jadi detektif matematika! 🔍"
  };
  
  // Clue tiap level
  const clues = {
    1: "Sudah siap memainkan level 1? Yuk mantapkan pemahamanmu dulu agar bisa mendapatkan skor terbaik di level ini!",
    2: "Yuk belajar materi pembagian agar kita bisa membagi benda menjadi kelompok yang sama besar!",
    4: "Terdapat 4 penjelajah cilik yang masing-masing memiliki persediaan apel sebanyak 2 buah. Berapakah total apel yang mereka miliki untuk bertahan selama 1 hari di hutan?"
  };

    // Judul penutup tiap level
  const closingTitles = {
    1: "Sudah paham kan? Siap jadi ahli kali cepat? 🚀",
    2: "Mudah, kan? Yuk asah kemampuan kamu dalam membagi angka!💪",
    4: "Yuk buktikan kemampuanmu menemukan operasi dan hasilnya! 🚀"
  };

  // Petunjuk / instruksi level (clue level)
  const levelInstructions = {
    1: "Yuk kita mulai berburu telur dinosaurus di level 1! pada level ini, kamu akan diberi 3 soal perkalian dengan waktu pengerjaan selama 3 menit. Sudah siap? kerjakan dengan teliti ya!",
    2: "Di level 2 kamu akan mengerjakan 2 soal pembagian yang masing-masing akan diberi waktu pengerjaan selama 3 menit. Jadi, jangan sampai salah hitung ya!",
    4: "Di level 3 kamu akan menyelesaikan 5 soal cerita (3 menit per soal) dan menuliskan dua angka, operasi, serta hasil akhirnya. jadi baca dengan teliti ya! jangan sampai ada yang salah☺️"
  };

  // Materi tambahan panjang + placeholder gambar per level
  const materials = {
    1: `Kita bisa melihat bahwa ada 5 kelompok (keranjang), dan tiap kelompok berisi 3 semangka.
        Kalau kita jumlahkan: 3 + 3 + 3 + 3 + 3 = 15 🍉
        Nah, itu sama artinya dengan 5 × 3 = 15 karena terdapat angka 3 sebanyak 5.
        
        Jadi, perkalian dapat diartikan sebagai penjumlahan berulang dari bilangan yang sama.
        Operasi ini membantu kita menghitung lebih cepat tanpa harus menulis penjumlahan panjang.`,
    2: `Terdapat 12 telur yang dibagi ke dalam 6 kelompok (keranjang), dan setiap keranjang berisi 2 telur.
        Nah dari sini kita bisa tulis operasi pembagiannya yaitu 12 ÷ 6 = 2 🪺

        Kalau kamu lihat dari sisi lain, pembagian juga bisa dianggap sebagai pengurangan berulang loh! 
        misal:
        12 - 6 - 6 = 0  →  karena ada 2 kali pengurangan → maka  12 (telur) ÷ 6 (keranjang) = 2 telur untuk setiap keranjang 
        
        Kesimpulannya, pembagian merupakan proses membagi sesuatu menjadi bagian yang sama besar, atau mengulang pengurangan bilangan yang sama.`,

    4: `Nah kalo kamu dapet teka teki berupa soal cerita, nih aku kasih tahu rahasia cara ngerjainnya🤫
        1️⃣ Baca soal dengan teliti dan temukan kata kunci.
        2️⃣ Temukan angka-angka penting.
        3️⃣ Dari kata kunci, tentukan operasinya.
        4️⃣ Hitung dan tulis hasil akhirnya.

        Pada soal, kita menemukan kata kunci yaitu "total" yang berarti kita perlu menjumlahkan apel secara keseluruhan atau kita bisa lakukan operasi perkalian untuk mempercepat proses hitungnya.
        Maka operasinya adalah : 2 + 2 + 2 + 2 = 2 × 4 = 8  🍎
        
        Mudah bukan? Intinya, kamu hanya perlu teliti dalam menemukan kata kunci dan angka yang ada pada soal cerita untuk menemukan jawabannya.
        `,
  };

  useEffect(() => {
    fetchLeaderboard();
    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  async function fetchLeaderboard() {
    try {
      const res = await apiClient.get("/api/leaderboard");
      setPlayers(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  function showStatus(msg, type = "info", duration = 3000) {
    setStatusMsg(msg);
    setStatusType(type);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => {
      setStatusMsg("");
      setStatusType("info");
    }, duration);
  }

  async function enterGame() {
    if (!name) {
      showStatus("Masukkan nama unik", "error");
      return;
    }
    try {
      const res = await apiClient.post("/api/player", { name });
      setPlayer(res.data.player);
      setPlayer((prev) => ({ ...res.data.player, levels: res.data.levels || [] }));
      showStatus("Selamat datang, " + res.data.player.name, "success");
      setName("");
      fetchLeaderboard();
    } catch (e) {
      console.error(e);
      showStatus("Gagal membuat pemain", "error");
    }
  }

  function handleFinish(data) {
    showStatus("Level selesai! Skor total: " + (data?.totalScore ?? ''), "success");
    setView("main");
    fetchLeaderboard();

    // Upayakan update player levels di UI bila server mengembalikan info terkait
    try {
      if (data?.player) {
        setPlayer(data.player)
      } else if (data?.updatedPlayer) {
        setPlayer((prev) => ({ ...prev, ...data.updatedPlayer }))
      } else if (data?.levels) {
        setPlayer((prev) => ({ ...(prev || {}), levels: data.levels }))
      }
    } catch (e) {
      console.warn('handleFinish update player failed', e)
    }
  }

  function resetName() {
    setPlayer(null);
    setName("");
  }

  // ---------------------- ADD / MOVE THIS (inside Home component, before return) ----------------------
  function canAccessLevel(num) {
    if (!player) return false;
    if (num === 1) return true;
    const levels = player.levels || [];

    for (let i = 1; i < num; i++) {
      const found = levels.find((l) => Number(l.level_number) === i);
      if (!found) {
        // level i tidak ada di DB -> anggap dilewati/di-skip, jadi lanjut
        continue;
      }
      // jika ada tetapi belum completed -> akses ditolak
      if (found.status !== "completed") return false;
    }
    return true;
  }
  // --------F-------------------------------------------------------------------------------------
function handleFinish(updatedPlayer) {
  if (updatedPlayer?.player && updatedPlayer?.levels) {
    setPlayer({ ...updatedPlayer.player, levels: updatedPlayer.levels });
  } else {
    setPlayer(updatedPlayer);
  }
  setView("main");
  fetchLeaderboard();
}

  // jika view level / dinoku
  if (view === "level" && selectedLevel)
    return (
      <Level
        player={player}
        levelNumber={selectedLevel}
        onFinish={handleFinish}
        onBack={() => setView("main")}
      />
    );
  if (view === "dinoku")
    return <Dinoku player={player} onBack={() => setView("main")} />;

  return (
    <div className="relative w-full min-h-screen">
      {/* Status/Toast */}
      {statusMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-lg shadow-lg text-sm sm:text-base ${
            statusType === "success"
              ? "bg-green-600 text-white"
              : statusType === "error"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {statusMsg}
        </motion.div>
      )}

      <div className="p-6 sm:p-8">
        {/* Judul (kalau belum ada nama) */}
        {!player?.name && (
          <div className="flex justify-center mb-6">
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold"
              style={{
                fontFamily: "'Bungee', cursive",
                color: "#fff",
                textShadow: `
                  7px 3px 0 #302f2f,
                  -3px -3px 0 #302f2f,
                  3px -3px 0 #302f2f,
                  -3px 3px 0 #302f2f
                `
              }}
            >
              MASUKKAN NAMAMU DIBAWAH INI
            </motion.h1>
          </div>
        )}

        {/* Input nama / ucapan */}
        <div className="flex flex-col items-center gap-4">
          {!player?.name ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <motion.input
                whileFocus={{ scale: 1.05 }}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                placeholder="Nama Petualang"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-jw text-sm sm:text-base"
                onClick={enterGame}
              >
                Enter
              </motion.button>
              {player?.name && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView("latihan")}
                className="btn-jw bg-[#658245] text-white px-6 py-3 text-base sm:text-lg mt-6 rounded-2xl shadow-lg"
              >
                📘 Mulai Latihan Materi
              </motion.button>
            )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-2 text-center"
              style={{
                fontFamily: "'Bungee', cursive",
                color: "#fff",
                textShadow: `
                  5px 2px 0 #302f2f,
                  -2px -2px 0 #302f2f,
                  2px -2px 0 #302f2f,
                  -2px 2px 0 #302f2f
                `
              }}
            >
              <motion.p
                className="font-black text-lg sm:text-xl text-white tracking-wide leading-relaxed"
                style={{
                  WebkitTextStroke: "0.8px black", // outline tipis
                  textShadow: "0 0 2px rgba(0,0,0,0.25)", // sedikit lembut di tepi
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Halo, {player.name}! 🎉
              </motion.p>

              <motion.p
                className="font-extrabold text-sm sm:text-base text-white max-w-xl tracking-wide leading-loose mt-3"
                style={{
                  WebkitTextStroke: "0.6px black",
                  textShadow: "0 0 1.5px rgba(0,0,0,0.25)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Mainkan setiap level untuk mengumpulkan telur dino🚀
              </motion.p>
              <motion.button
                onClick={resetName}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 px-3 py-1 text-xs sm:text-sm rounded-xl border-2 border-gray-500 shadow bg-white text-gray-700"
              >
                Ganti Nama
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Tombol Mulai Latihan Materi */}
        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-jw bg-[#658245] text-white px-6 py-3 text-base sm:text-lg rounded-2xl shadow-lg"
            onClick={() => {
              if (!player) {
                showStatus("Masukkan nama dulu sebelum memulai latihan!", "error");
                return;
              }
              onGoLatihan();
            }}
          >
            📘 Mulai Latihan Materi
          </motion.button>
        </div>

        {/* Pulau Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
          {/* Pulau Petualangan */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <p
              className="font-black text-base sm:text-lg text-white leading-relaxed"
              style={{
                WebkitTextStroke: "0.8px black", // outline halus tapi tetap jelas
                textShadow: "0 0 2px rgba(0,0,0,0.25)", // bayangan lembut
                letterSpacing: "0.08em", // jarak antar huruf sedikit lebih rapat
              }}
            >
              Baca instruksi 🔍
            </p>
            <div className="flex flex-col gap-3">
              {[1, 2, 4].map((num, i) => {
                // Tampilkan label 3 jika num = 4, tapi kirim nilai aslinya (4)
                const displayNumber = num === 4 ? 3 : num;
                return (
                  <motion.div
                    key={num}
                    className="flex gap-2 items-center"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <motion.button
                      className="btn-jw text-xs sm:text-sm"
                      onClick={() => {
                        if (!player) {
                          setSelectedLevel(num);
                          setView("level");
                          return;
                        }

                        if (!canAccessLevel(num)) {
                          showStatus(`Selesaikan level sebelumnya untuk membuka Level ${displayNumber}`, "error");
                          return;
                        }

                        setSelectedLevel(num);
                        setView("level");
                      }}
                      disabled={!canAccessLevel(num) && !!player}
                      title={!canAccessLevel(num) && !!player
                        ? `Locked: selesaikan level sebelumnya`
                        : `Buka Level ${displayNumber}`}
                    >
                      Level {displayNumber}
                    </motion.button>

                    <motion.button
                      className="btn-jw px-3 py-2 text-xs sm:text-sm"
                      onClick={() => setClueLevel(num)}
                    >
                      🔍
                    </motion.button>
                  </motion.div>
                    );
              })}
            </div>
          </div>

          {/* Koleksi Dinoku */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center sm:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-jw text-sm sm:text-base"
              onClick={() => setView("dinoku")}
            >
              Koleksi Dinoku
            </motion.button>
          </motion.div>
        </div>

        {/* Popup Clue (diperbesar & scrollable seperti leaderboard) */}
        {clueLevel && clueLevel !== 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          >
            <div className="bg-[#fff] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80%] flex flex-col overflow-hidden border-4 border-[#394b23]">
              {/* Header */}
              <div className="bg-[#394b23] text-white py-4 px-6 text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold">
                  🔍 Clue & Materi — Level {clueLevel === 4 ? 3 : clueLevel}
                </h2>
              </div>

              {/* Content wrapper: scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Short clue */}
                <div className="mb-4">
                  <h3 className="font-bold text-center text-sm mb-2">
                    {clueTitles[clueLevel] || "Apa yang akan kita lakukan pada level ini?🤔"}
                  </h3>
                  <p className="text-center text-sm text-gray-700">{clues[clueLevel]}</p>
                </div>

                {/* Ilustrasi */}
                <div className="mb-6 flex justify-center">
                  <img
                    src={`/assets/images/gambar_ilustrasi_materi_${clueLevel}.png`}
                    alt={`Ilustrasi materi level ${clueLevel}`}
                    className="max-h-48 object-contain rounded-lg border shadow-sm"
                    onError={(e) => {
                      // fallback bila gambar tidak ditemukan
                      e.currentTarget.src = `/assets/images/placeholder_materi.png`;
                    }}
                  />
                </div>

                {/* Materi panjang (placeholder) */}
                <div className="mb-6">
                  <h4 className="font-bold text-base mb-2">Apa arti gambar di atas?</h4>
                    <p className="text-justify text-sm leading-relaxed whitespace-pre-line font-poppins text-gray-800">
                      {materials[clueLevel]}
                    </p>
                </div>

                {/* Penutup dan instruksi level */}
                <div className="mb-6 text-center">
                  <h4 className="font-bold text-base mb-2 text-[#394b23]">
                    {closingTitles[clueLevel]}
                  </h4>
                    <p className="text-center text-sm leading-relaxed whitespace-pre-line font-poppins text-gray-800">
                    {levelInstructions[clueLevel]}
                  </p>
                </div>
              </div>

              {/* Footer (tombol tutup) */}
              <div className="bg-[#658245] py-3 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#394b23] hover:bg-[#5a7041] transition"
                  onClick={() => setClueLevel(null)}
                >
                  ✖ Tutup
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="btn-jw fixed bottom-6 right-6 z-[999] text-sm sm:text-base"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLeaderboard(true)}
        >
          🏆 Leaderboard
        </motion.button>

        {/* Popup Leaderboard */}
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          >
            <div className="bg-[#cde5fd] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80%] flex flex-col overflow-hidden border-4 border-[#394b23]">
              {/* Header */}
              <div className="bg-[#394b23] text-white py-4 px-6 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
                  🏆 Leaderboard
                </h2>
              </div>
              {/* Table wrapper */}
              <div className="flex-1 overflow-y-auto overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <thead className="bg-[#7ea356] text-white sticky top-0">
                    <tr>
                      <th className="p-3 text-left w-10">#</th>
                      <th className="p-3 text-left w-20">Medali</th>
                      <th className="p-3 text-left w-48">Nama</th>
                      <th className="p-3 text-left w-24">Skor</th>
                      <th className="p-3 text-left w-24">Waktu</th>
                      <th className="p-3 text-left w-24">Dino</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((p, idx) => (
                      <tr
                        key={p.id}
                        className={`${
                          idx % 2 === 0 ? "bg-[#fff3d9]" : "bg-[#cde5fd]"
                        } hover:bg-[#7ea356]/20 transition`}
                      >
                        {/* Kolom 1: Nomor urut */}
                        <td className="p-3 font-bold text-[#394b23] text-center">{idx + 1}</td>

                        {/* Kolom 2: Medali */}
                        <td className="p-3 text-center text-lg">
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "-"}
                        </td>

                        {/* Kolom 3: Nama */}
                        <td className="p-3 font-semibold text-[#394b23]">{p.name}</td>

                        {/* Kolom 4–6 */}
                        <td className="p-3 text-[#566569] text-center">{p.total_score}</td>
                        <td className="p-3 text-[#566569] text-center">{p.total_time}</td>
                        <td className="p-3 text-[#566569] text-center">{p.dinos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Footer */}
              <div className="bg-[#658245] py-3 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#394b23] hover:bg-[#5a7041] transition"
                  onClick={() => setShowLeaderboard(false)}
                >
                  ✖ Tutup
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tombol Kuisioner */}
        <div className="mt-8 text-center">
          <motion.button
            className="btn-jw bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-2xl shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              window.open("https://forms.gle/iJSuRVFGCKW9ZUXd7", "_blank")
            }
          >
            📝 Isi Kuisioner Jurassic Math
          </motion.button>
        </div>

        {/* Tombol Kembali */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="fixed bottom-4 left-4"
        >
          <button onClick={onBack} className="btn-jw text-xs sm:text-sm">
            ↩
          </button>
        </motion.div>
      </div>
    </div>
  );
}
