// routes/index.js
const express = require('express');
const router = express.Router();
const { supabase } = require('../models');

// Health
router.get('/health', (req, res) => res.json({ ok: true }));

// Create or get player by name (simple login)
router.post('/player', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  // Find existing player
  const { data: existingPlayers, error: findError } = await supabase
    .from('players')
    .select('*')
    .eq('name', name)
    .limit(1);

  if (findError) {
    console.error('Error finding player:', findError);
    return res.status(500).json({ error: 'Database error' });
  }

  let player = existingPlayers && existingPlayers.length > 0 ? existingPlayers[0] : null;

  if (!player) {
    // Create new player
    const { data: newPlayer, error: createError } = await supabase
      .from('players')
      .insert([{ name, score: 0, total_time: 0 }])
      .select()
      .single();

    if (createError) {
      console.error('Error creating player:', createError);
      return res.status(500).json({ error: 'Database error' });
    }

    player = newPlayer;

    // Create level rows
    const { error: levelsError } = await supabase
      .from('levels')
      .insert([
        { player_id: player.id, level_number: 1, status: 'unlocked' },
        { player_id: player.id, level_number: 2, status: 'locked' },
        { player_id: player.id, level_number: 4, status: 'locked' }
      ]);

    if (levelsError) {
      console.error('Error creating levels:', levelsError);
    }
  }

  // Get levels
  const { data: levels, error: levelsError } = await supabase
    .from('levels')
    .select('*')
    .eq('player_id', player.id);

  if (levelsError) {
    console.error('Error fetching levels:', levelsError);
  }

  // Get dinos
  const { data: dinos, error: dinosError } = await supabase
    .from('dinos')
    .select('*')
    .eq('player_id', player.id);

  if (dinosError) {
    console.error('Error fetching dinos:', dinosError);
  }

  res.json({ player, levels: levels || [], dinos: dinos || [] });
});

// Get questions by level (custom generator for level 1 & 2)
router.get('/questions/:playerId/:level', async (req, res) => {
  const level = parseInt(req.params.level);
  const playerId = parseInt(req.params.playerId);

  // Cek status level pemain
  const { data: lvlRow, error: lvlError } = await supabase
    .from('levels')
    .select('*')
    .eq('player_id', playerId)
    .eq('level_number', level)
    .limit(1)
    .single();

  if (lvlRow && lvlRow.status === 'completed') {
    return res.status(409).json({
      error: 'Level already completed',
      score: lvlRow.score,
      time_spent: lvlRow.time_spent
    });
  }

  // =====================
  // LEVEL 1: Perkalian
  // =====================
  if (level === 1) {
    const qs = [];

    // 1) 2 digit × 1 digit
    const a1 = Math.floor(Math.random() * 90) + 10; // 10-99
    const b1 = Math.floor(Math.random() * 9) + 1;   // 1-9
    qs.push({
      id: 1,
      question_text: `${a1} × ${b1} = ?`,
      number1: a1,
      number2: b1,
      operation: '×',
      correct_answer: String(a1 * b1)
    });

    // 2) 1 digit × 2 digit
    const a2 = Math.floor(Math.random() * 9) + 1;   // 1-9
    const b2 = Math.floor(Math.random() * 90) + 10; // 10-99
    qs.push({
      id: 2,
      question_text: `${a2} × ${b2} = ?`,
      number1: a2,
      number2: b2,
      operation: '×',
      correct_answer: String(a2 * b2)
    });

    // 3) 2 digit × 2 digit
    const a3 = Math.floor(Math.random() * 90) + 10;
    const b3 = Math.floor(Math.random() * 90) + 10;
    qs.push({
      id: 3,
      question_text: `${a3} × ${b3} = ?`,
      number1: a3,
      number2: b3,
      operation: '×',
      correct_answer: String(a3 * b3)
    });

    return res.json(qs);
  }

  // =====================
  // LEVEL 2: Pembagian
  // =====================
  if (level === 2) {
    const qs = [];

    // Helper: generate a pair (dividend, divisor, quotient) such that
    // divisor in [minDiv, maxDiv], quotient >=1 integer, and dividend=divisor*quotient is 2-digit (10..99)
    function generatePair(minDiv, maxDiv) {
      // safety guard to avoid infinite loop
      for (let attempts = 0; attempts < 1000; attempts++) {
        const divisor = Math.floor(Math.random() * (maxDiv - minDiv + 1)) + minDiv;
        // compute allowed quotient range so that dividend = divisor * quotient is between 10 and 99
        const minQ = Math.ceil(10 / divisor);
        const maxQ = Math.floor(99 / divisor);
        if (maxQ < 1 || minQ > maxQ) continue; // no valid quotient for this divisor, retry

        const quotient = Math.floor(Math.random() * (maxQ - minQ + 1)) + minQ;
        const dividend = divisor * quotient;
        if (dividend >= 10 && dividend <= 99) {
          return { dividend, divisor, quotient };
        }
      }
      // fallback (shouldn't normally happen)
      return { dividend: 12, divisor: 3, quotient: 4 };
    }

    // 1) 2 digit ÷ 1 digit (hasil bulat)
    const pair1 = generatePair(1, 9); // divisor 1..9, ensure dividend is 2-digit
    qs.push({
      id: 1,
      question_text: `${pair1.dividend} ÷ ${pair1.divisor} = ?`,
      number1: pair1.dividend,
      number2: pair1.divisor,
      operation: '÷',
      correct_answer: String(pair1.quotient)
    });

    // 2) 2 digit ÷ 2 digit (hasil bulat)
    // ensure divisor is at least 10
    const pair2 = generatePair(10, 99);
    qs.push({
      id: 2,
      question_text: `${pair2.dividend} ÷ ${pair2.divisor} = ?`,
      number1: pair2.dividend,
      number2: pair2.divisor,
      operation: '÷',
      correct_answer: String(pair2.quotient)
    });

    return res.json(qs);
  }
  // =====================
  // LEVEL LAIN (3 & 4)
  // =====================
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('*')
    .eq('level', level);

  if (qError) {
    console.error('Error fetching questions:', qError);
    return res.status(500).json({ error: 'Database error' });
  }

  return res.json(questions || []);
});

// Submit answer for a question
router.post('/answer', async (req, res) => {
  const { player_id, question_id, level, answer_payload, time_spent } = req.body;
  if (!player_id || !level) {
    return res.status(400).json({ error: 'player_id and level required' });
  }

  let isCorrect = false;
  let correctAnswer = null;

  if (level === 1 || level === 2) {
    // answer_payload expected { number1, number2, operation, final_answer }
    const { number1, number2, operation, final_answer } = answer_payload || {};
    if (operation === '×') {
      correctAnswer = String(Number(number1) * Number(number2));
    } else if (operation === '÷') {
      correctAnswer = String(Number(number1) / Number(number2));
    }
    isCorrect = String(final_answer) === String(correctAnswer);
  } else if (level === 4) {
    const { data: q, error: qError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', question_id)
      .limit(1)
      .single();

    isCorrect = false; // reset biar gak bawa nilai dari level lain
    correctAnswer = q ? q.correct_answer : null;

    if (q && answer_payload) {
      // TERAPKAN normalisasi & mapping operator di sini
      let providedOp = (answer_payload.operation || '').trim();
      // beberapa frontend mungkin mengirim ":" untuk pembagian — map itu ke '÷'
      if (providedOp === ':' || providedOp === '/') providedOp = '÷';

      const n1 = answer_payload.number1;
      const n2 = answer_payload.number2;
      const final = answer_payload.final_answer;

      // validasi: kalau ada yang kosong, langsung salah
      if (
        n1 === '' ||
        n2 === '' ||
        final === '' ||
        providedOp === '' ||
        providedOp === undefined
      ) {
        isCorrect = false;
      } else {
        // convert ke number dengan fallback NaN handling
        const a = Number(n1);
        const b = Number(n2);
        const finalAns = Number(final);

        // jika parsing gagal (NaN), anggap salah
        if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(finalAns)) {
          isCorrect = false;
        } else {
          let calc = null;

          if (providedOp === '×' || providedOp === 'x' || providedOp === '*') calc = a * b;
          if (providedOp === '÷') calc = b !== 0 ? a / b : null;

          if (calc !== null) {
            // perbandingan toleran: gunakan Number equality
            isCorrect = finalAns === calc;

            // terima perkalian terbalik (n2 * n1)
            if (!isCorrect && (providedOp === '×' || providedOp === 'x' || providedOp === '*')) {
              isCorrect = finalAns === Number(n2) * Number(n1);
            }
          } else {
            isCorrect = false;
          }
        }
      }
    }
  }

  // Save answer (include level)
  const { data: answerRow, error: answerError } = await supabase
    .from('answers')
    .insert([{
      player_id,
      question_id: question_id || null,
      answer_text: String(JSON.stringify(answer_payload)),
      is_correct: !!isCorrect,
      time_spent: time_spent || 0,
      level: level || null
    }])
    .select()
    .single();

  if (answerError) {
    console.error('Error creating answer:', answerError);
    return res.status(500).json({ error: 'Database error' });
  }

  if (isCorrect) {
    const dinoTypes = [
      'Allosaurus',
      'Ankylosaurus',
      'Apatosaurus',
      'Argentinosaurus',
      'Brachiosaurus',
      'Carnotaurus',
      'Compsognathus',
      'Cryolophosaurus',
      'Dilophosaurus',
      'Dracorex',
      'Edmontosaurus',
      'Giganotosaurus',
      'Iguanodon',
      'Kentrosaurus',
      'Maiasaura',
      'Microraptor',
      'Mononykus',
      'Ouranosaurus',
      'Pachycephalosaurus',
      'Parasaurolophus',
      'Pterodactyl',
      'Sauropelta',
      'Spinosaurus',
      'Stegosaurus',
      'Tarbosaurus',
      'Therizinosaurus',
      'Triceratops',
      'Troodon',
      'Tyrannosaurus_Rex',
      'Velociraptor'
    ];
    const type = dinoTypes[Math.floor(Math.random() * dinoTypes.length)];
    const name = `${type}-${Math.floor(Math.random() * 9000) + 1000}`;
    const img = `/assets/images/${type.toLowerCase()}.png`;

    let newDino;
    try {
      const { data: createdDino, error: dinoError } = await supabase
        .from('dinos')
        .insert([{
          player_id,
          dino_name: name,
          dino_type: type,
          image: img,
          answer_id: answerRow.id
        }])
        .select()
        .single();

      if (dinoError) {
        console.warn('Dino creation failed (maybe duplicate):', dinoError);
        // Try to find existing dino
        const { data: existingDino } = await supabase
          .from('dinos')
          .select('*')
          .eq('answer_id', answerRow.id)
          .limit(1)
          .single();
        newDino = existingDino;
      } else {
        newDino = createdDino;
      }
    } catch (err) {
      console.error('Failed to create/find dino:', err);
      newDino = null;
    }
    return res.json({ ok: true, isCorrect, correctAnswer, obtainedDino: newDino });
  } else {
    return res.json({ ok: true, isCorrect, correctAnswer });
  }
});

// Finish level
router.post('/finish-level', async (req, res) => {
  try {
    const { player_id, level, obtained_correct_count, time_spent } = req.body;
    if (!player_id || !level)
      return res.status(400).json({ error: 'player_id and level required' });

    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('id', player_id)
      .limit(1)
      .single();

    if (playerError || !player) return res.status(404).json({ error: 'Player not found' });

    const { data: lvlRow, error: lvlError } = await supabase
      .from('levels')
      .select('*')
      .eq('player_id', player_id)
      .eq('level_number', level)
      .limit(1)
      .single();

    if (lvlRow && lvlRow.status === 'completed') {
      return res.status(409).json({ error: 'Level already completed' });
    }

    const points = (obtained_correct_count || 0) * 10;

    // Update level status
    if (lvlRow) {
      const { error: updateError } = await supabase
        .from('levels')
        .update({ status: 'completed', score: points, time_spent: time_spent || 0 })
        .eq('id', lvlRow.id);

      if (updateError) {
        console.error('Error updating level:', updateError);
      }
    } else {
      const { error: createError } = await supabase
        .from('levels')
        .insert([{
          player_id,
          level_number: level,
          status: 'completed',
          score: points,
          time_spent: time_spent || 0
        }]);

      if (createError) {
        console.error('Error creating level:', createError);
      }
    }

    // Update player total
    const { data: levels, error: levelsError } = await supabase
      .from('levels')
      .select('*')
      .eq('player_id', player_id);

    if (levelsError) {
      console.error('Error fetching levels:', levelsError);
    }

    const totalScore = (levels || []).reduce((s, r) => s + (r.score || 0), 0);
    const totalTime = (levels || []).reduce((t, r) => t + (r.time_spent || 0), 0);

    const { error: playerUpdateError } = await supabase
      .from('players')
      .update({ score: totalScore, total_time: totalTime })
      .eq('id', player_id);

    if (playerUpdateError) {
      console.error('Error updating player:', playerUpdateError);
    }

    // Unlock next level (skip 3 karena tidak ada level 3)
    let nextLevel = parseInt(level) + 1;
    if (nextLevel === 3) nextLevel = 4;

    const { data: nextLvl } = await supabase
      .from('levels')
      .select('*')
      .eq('player_id', player_id)
      .eq('level_number', nextLevel)
      .limit(1)
      .single();

    if (!nextLvl && nextLevel <= 4) {
      const { error: createNextError } = await supabase
        .from('levels')
        .insert([{
          player_id,
          level_number: nextLevel,
          status: 'unlocked'
        }]);

      if (createNextError) {
        console.error('Error creating next level:', createNextError);
      }
    }

    // Beri dinos sesuai jawaban benar
    const { data: correctAnswers, error: answersError } = await supabase
      .from('answers')
      .select('id')
      .eq('player_id', player_id)
      .eq('level', level)
      .eq('is_correct', true);

    if (answersError) {
      console.error('Error fetching correct answers:', answersError);
    }

    const correctAnswerIds = (correctAnswers || []).map(a => a.id);
    
    const { data: existingDinos, error: dinosError } = await supabase
      .from('dinos')
      .select('answer_id')
      .in('answer_id', correctAnswerIds);

    const alreadyAwarded = (existingDinos || []).length;
    const toCreate = Math.max(0, (obtained_correct_count || 0) - alreadyAwarded);
    
    const dinoTypes = [
      'Allosaurus', 'Ankylosaurus', 'Apatosaurus', 'Argentinosaurus',
      'Brachiosaurus', 'Carnotaurus', 'Compsognathus', 'Cryolophosaurus',
      'Dilophosaurus', 'Dracorex', 'Edmontosaurus', 'Giganotosaurus',
      'Iguanodon', 'Kentrosaurus', 'Maiasaura', 'Microraptor',
      'Mononykus', 'Ouranosaurus', 'Pachycephalosaurus', 'Parasaurolophus',
      'Pterodactyl', 'Sauropelta', 'Spinosaurus', 'Stegosaurus',
      'Tarbosaurus', 'Therizinosaurus', 'Triceratops', 'Troodon',
      'Tyrannosaurus_Rex', 'Velociraptor'
    ];

    const obtained = [];
    for (let i = 0; i < toCreate; i++) {
      const type = dinoTypes[Math.floor(Math.random() * dinoTypes.length)];
      const name = `${type}-${Math.floor(Math.random() * 9000) + 1000}`;
      const img = `/assets/images/${type.toLowerCase()}.png`;
      
      const { data: d, error: dError } = await supabase
        .from('dinos')
        .insert([{ player_id, dino_name: name, dino_type: type, image: img }])
        .select()
        .single();

      if (!dError && d) {
        obtained.push(d);
      }
    }

    // Ambil data player & levels terbaru untuk dikirim ke frontend
    const { data: updatedPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('id', player_id)
      .limit(1)
      .single();

    const { data: updatedLevels } = await supabase
      .from('levels')
      .select('*')
      .eq('player_id', player_id);

    // ✅ Kirim semua data terbaru ke frontend
    res.json({
      success: true,
      message: `Level ${level} completed successfully.`,
      next_level_unlocked: nextLevel,
      score: points,
      totalScore,
      totalTime,
      obtained,
      player: updatedPlayer,
      levels: updatedLevels || []
    });

  } catch (err) {
    console.error('❌ Error in /finish-level:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dinos for player
router.get('/dinos/:playerId', async (req, res) => {
  const playerId = parseInt(req.params.playerId);
  const { data: dinos, error: dinosError } = await supabase
    .from('dinos')
    .select('*')
    .eq('player_id', playerId)
    .order('obtained_at', { ascending: false });

  if (dinosError) {
    console.error('Error fetching dinos:', dinosError);
    return res.status(500).json({ error: 'Database error' });
  }

  res.json(dinos || []);
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('*')
    .order('score', { ascending: false })
    .order('total_time', { ascending: true });

  if (playersError) {
    console.error('Error fetching players:', playersError);
    return res.status(500).json({ error: 'Database error' });
  }

  const result = await Promise.all(
    (players || []).map(async p => {
      const { count, error: countError } = await supabase
        .from('dinos')
        .select('*', { count: 'exact', head: true })
        .eq('player_id', p.id);

      if (countError) {
        console.error('Error counting dinos:', countError);
      }

      return {
        id: p.id,
        name: p.name,
        total_score: p.score || 0,
        total_time: p.total_time || 0,
        dinos: count || 0
      };
    })
  );

  res.json(result);
});

module.exports = router;
