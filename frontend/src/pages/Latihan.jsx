// src/pages/Latihan.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Latihan({ player, onBack }) {
  // 🌿 STATE UTAMA
  const [view, setView] = useState("menu");

  // ✅ state pusat untuk rekap
  const [scores, setScores] = useState({
    perkalian: 0,
    pembagian: 0,
    cerita: 0,
  });

  // progress tiap modul
  const [completedModules, setCompletedModules] = useState({
    perkalian: false,
    pembagian: false,
    cerita: false,
  });

  // updated markCompleted: simpan modul sebagai completed dan simpan skor final modul ke scores
  const markCompleted = (module, score = 0) => {
    setCompletedModules((prev) => ({ ...prev, [module]: true }));
    setScores((prev) => ({ ...prev, [module]: score }));
  };

  // 🌟 Perkalian
  const [perkalianStep, setPerkalianStep] = useState(0);
  const [perkalianScore, setPerkalianScore] = useState(0);
  const [perkalianSelected, setPerkalianSelected] = useState(null);
  const [perkalianAttempts, setPerkalianAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // 🌟 Pembagian
  const [pembagianStep, setPembagianStep] = useState(0);
  const [pembagianScore, setPembagianScore] = useState(0);
  const [pembagianSelected, setPembagianSelected] = useState(null);
  const [pembagianAttempts, setPembagianAttempts] = useState(0);

  // 🌟 Cerita
  const [ceritaStep, setCeritaStep] = useState(0);
  const [ceritaScore, setCeritaScore] = useState(0);
  const [ceritaSelected, setCeritaSelected] = useState(null);
  const [ceritaAttempts, setCeritaAttempts] = useState(0);

  // reset jika user kembali ke menu
const handleBackToMenu = () => {
  setView("menu");

  // reset UI/step/attempts tapi TIDAK mereset skor final yang digunakan rekap
  setPerkalianStep(0);
  setPerkalianSelected(null);
  setPerkalianAttempts(0);
  setPembagianStep(0);
  setPembagianSelected(null);
  setPembagianAttempts(0);
  setCeritaStep(0);
  setCeritaAttempts(0);
  setShowFeedback(false);
  setFeedbackMsg("");
};


  // ==========================
  // 📗 MATERI & SOAL PERKALIAN
  // ==========================
  const perkalianSteps = [
    {
      type: "materi",
      title: "Yuk Amati Gambar Ilustrasi berikut🍎",
      text: "Lihat deh, ada beberapa pohon yang berbuah apel. Coba hitung, setiap pohon punya berapa apel ya? \n\nHmm... sepertinya jumlahnya sama, kan? \n\nYuk bantu aku mencari tahu berapa total apelnya! 🔍",
      img: "/assets/images/placeholder_1.png",
    },
    {
      type: "soal",
      question:
        "Ada 4 pohon, masing-masing berisi 3 apel. Kira-kira berapa semua apel yang ada?",
      options: ["7", "8", "9", "12"],
      correct: "12",
      img: "/assets/images/placeholder_1.png",
    },
    {
      type: "materi",
      title: "Wah, Seru Ya! 🌿",
      text: "Nah, kalau tadi kamu berhasil menghitung semua apel, artinya kamu sudah melakukan perkalian lho! \n\nPerkalian itu sama seperti menjumlahkan bilangan yang sama berulang kali. \n\nMisalnya, 4 pohon dengan 3 apel artinya 3 + 3 + 3 + 3 = 12. \n\nMudah bukan?",
      img: "/assets/images/placeholder_1.png",
    },
    {
      type: "soal",
      question:
        "Sekarang bayangkan ada 5 keranjang buah. Masing-masing berisi 2 buah apel. Berapa total apel semuanya?",
      options: ["7", "9", "10", "12"],
      correct: "10",
      img: "/assets/images/placeholder_2.png",
    },
    {
      type: "materi",
      title: "Kesimpulan Materi Perkalian 📖",
      text: "Keren banget! Jadi, perkalian membantu kita menghitung jumlah total dari kelompok yang sama besar, atau dalam kata lain bisa dikatakan bahwa perkalian merupakan penjumlahan berulang. \n\nYuk sekarang kita uji pemahamanmu sekali lagi pada soal latihan selanjutnya💪",
      img: "/assets/images/placeholder_2.png",
    },
    {
      type: "soal",
      question:
        "Di Jurassic Garden, ada 8 bayi dinosaurus Triceratops yang sedang makan daun segar. Setiap bayi dinosaurus memiliki 3 cula di kepalanya. Berapa jumlah seluruh cula yang dimiliki oleh 8 bayi dinosaurus itu?",
      options: ["24", "12", "15", "18"],
      correct: "24",
      img: "/assets/images/placeholder_3.png",
    },
  ];

  // ==========================
  // 📘 PEMBAGIAN
  // ==========================
  const pembagianSteps = [
    {
      type: "materi",
      title: "tahukah kamu?🍕",
      text: "Pembagian ternyata adalah kebalikan dari perkalian, lho! 😄 \n\nKalau perkalian berarti menjumlahkan kelompok dengan jumlah yang sama, maka pembagian berarti membagi sesuatu menjadi kelompok yang sama besar.\n\nMisalnya, kamu punya satu pizza utuh yang dipotong menjadi 8 bagian sama besar. Kemudian kamu mau berbagi pizza itu kepada teman-temanmu dengan jumlah yang sama agar adil. \n\nKira-kira gimana ya caranya? Coba berikan pendapatmu pada soal latihan di menu berikutnya! 🍕✨",
      img: "/assets/images/placeholder_4.png",
    },
    {
      type: "soal",
      question:
        "Terdapat 8 potong pizza yang ingin kamu bagi kepada 4 temanmu. Agar adil, setiap teman harus mendapat bagian yang sama banyak. Berapa potong pizza yang didapatkan setiap orang?",
      options: ["2", "4", "5", "6"],
      correct: "2",
      img: "/assets/images/placeholder_4.png",
    },
    {
      type: "materi",
      title: "Membagi ke Lebih Sedikit Teman 😋",
      text: "Kamu hebat! 🎉 Saat tadi kamu membagi 8 potong pizza ke 4 teman, setiap orang mendapat 2 potong. \n\nNah, bagaimana kalau kali ini kamu hanya membagi ke 2 teman saja? Tentunya, karena teman yang menerima lebih sedikit, setiap orang akan mendapat bagian yang lebih banyak, bukan? \n\nYuk, coba beri tahu aku jawaban kamu di latihan berikutnya! 🔍",
      img: "/assets/images/placeholder_5.png",
    },
    {
      type: "soal",
      question:
        "Sekarang ada 8 potong pizza, tapi hanya akan dibagi kepada 2 teman. Berapa potong pizza yang didapatkan oleh masing-masing teman?",
      options: ["6", "8", "4", "12"],
      correct: "4",
      img: "/assets/images/placeholder_6.png",
    },
    {
      type: "materi",
      title: "Hubungan Perkalian dan Pembagian 🍕➗✖️",
      text: "Coba amati ya! Tadi kamu sudah menghitung 8 ÷ 4 = 2 dan 8 ÷ 2 = 4. Nah, dua bentuk pembagian ini ternyata berkaitan dengan perkalian, lho! 😍\n\nKalau 4 × 2 = 8 dan 2 × 4 = 8, maka dari satu perkalian, kita bisa membuat dua pembagian:\n👉 8 ÷ 4 = 2\n👉 8 ÷ 2 = 4\n\nArtinya, pembagian dan perkalian itu seperti dua sahabat yang saling melengkapi! Jika kamu tahu hasil kali dua bilangan, kamu juga bisa tahu hasil pembagiannya. Hebat kan? 💪 Yuk lanjut ke latihan berikutnya untuk memastikan kamu benar-benar paham! 🦖",
      img: "/assets/images/placeholder_7.png",
    },
    {
      type: "soal",
      question:
        "Dua peneliti di Jurassic Garden menemukan 28 telur dinosaurus di dalam hutan. Mereka ingin membagi telur-telur itu secara sama rata ke dalam 4 kotak penyimpanan khusus agar mudah dibawa ke laboratorium. Berapa banyak telur dinosaurus yang dimasukkan ke dalam setiap kotak?",
      options: ["4", "8", "7", "6"],
      correct: "7",
      img: "/assets/images/placeholder_8.png",
    },
    {
      type: "materi",
      title: "Kesimpulan Materi Pembagian 📖",
      text: "Hebat! 🎉 Sekarang kamu sudah tahu bahwa pembagian dan perkalian saling berhubungan erat. Perkalian menambah kelompok dengan jumlah sama, sedangkan pembagian membagi sesuatu menjadi kelompok yang sama besar. \n\nJadi, pembagian bisa membantu kita memahami perkalian, dan sebaliknya! \n\nTerus semangat ya, Jika kamu sudah siap, yuk kita lanjut ke tahap berikutnya, kita akan belajar bagaimana menyelesaikan soal cerita dengan berbagai tips yang akan membantu kamu! 🦕🌿",
      img: "/assets/images/placeholder_8.png",
    },
  ];

  // ==========================
  // 📙 CERITA
  // ==========================
  const ceritaSteps = [
    {
      type: "materi",
      title: "Petualangan Soal Cerita Dimulai! 🦖",
      text:
        "Perhatikan soal cerita berikut:\n\n" +
        "Seorang anak bernama Frietz ingin memberikan makanan kepada 5 bayi dinosaurus di taman Jurassic Mini. Ia memiliki 15 ember yang berisi wortel, makanan kesukaan para bayi dino tersebut. Jika Frietz ingin membagi semua ember dengan adil kepada setiap bayi dino, berapa jumlah ember yang didapat oleh masing masing dari mereka?\n\n"+
        "✨TIPS PENGERJAAN SOAL CERITA✨\n" +
        "Untuk bisa menyelesaikannya, ada 4 langkah yang bisa kamu ikuti:\n\n" +
        "1️⃣ Memahami permasalahan \nDiketahui: 5 bayi dino dan 15 ember makanan \nDitanyakan: jumlah ember yang didapatkan masing-masing dino\n\n" +
        "2️⃣ Menyusun rencana pemecahan \nTentukan operasinya (perkalian/pembagian) \nKarena pada soal terdapat kata *membagi* maka kemungkinan besar operasi yang digunakan adalah pembagian\n\n" +
        "3️⃣ Melaksanakan penyelesaian \nGunakan operasi pembagian → 15 ÷ 5 = 3 \n\n" +
        "4️⃣ Meninjau kembali hasil \nJadi, jumlah ember yang didapatkan masing-masing dino adalah sebanyak 3 ember\n\n" +
        "Mudah bukan? Kamu hanya perlu menemukan kata kunci dari setiap soal untuk menentukan operasi yang digunakan dan juga temukan angka yang akan digunakan dalam pemecahan masalah🌿 \n\n" +
        "Sekarang, yuk coba uji kemampuan pemecahan masalahmu dengan mengerjakan soal cerita pada latihan berikutnya!",
      img: "/assets/images/placeholder_9.png",
    },
    {
      type: "soal",
      question:
        "Marsel sangat suka mengoleksi kartu bergambar dinosaurus. Suatu hari, ia menemukan 3 kotak khusus untuk menyimpan koleksinya. Setiap kotak berisi 6 kartu dinosaurus yang berbeda-beda. Berapakah jumlah seluruh kartu yang dimiliki oleh Marsel?",
      options: ["36", "42", "18", "40"],
      correct: "18",
      img: "/assets/images/placeholder_10.png",
    },
    {
      type: "materi",
      title: "Kata Kunci Ajaib 🧩",
      text: "Yey! kamu berhasil menemukan kata kunci ajaib dari soal sebelumnya! \nKarena pada pertanyaan dikatakan *berapa jumlah seluruh kartu* maka kemungkinan besar operasi yang digunakan adalah perkalian, yang mana ini sejalan dengan konsep dasar yaitu perkalian sebagai penjumlahan berulang: \n\n6 + 6 + 6 = 18 \natau sama juga dengan \n6 × 3 = 18 \nkarena terdapat 6 kartu sebanyak 3 kotak  "+
      "\n\nSepertinya kamu sudah sangat siap untuk menuju ke tantangan berikutnya🚀 Cek hasil latihanmu di menu Rekap dan mulai penjelajahan yang sesungguhnya di halaman utama! \n\nAku sudah siapkan 3 level menarik yang bisa kamu mainkan untuk menguji kemampuanmu dalam memecahkan soal cerita perkalian dan pembagian🔥 \n\nMainkan dengan penuh kepercayaan diri dan kumpulkan telur dinosaurus sebanyak mungkin! ",
      img: "/assets/images/placeholder_10.png",
    },
  ];

  // Load progress dari localStorage saat komponen pertama kali muncul
  useEffect(() => {
    const savedScores = localStorage.getItem("scores");
    const savedCompleted = localStorage.getItem("completedModules");

    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedCompleted) setCompletedModules(JSON.parse(savedCompleted));
  }, []);
  // Simpan skor otomatis jika berubah
  useEffect(() => {
    localStorage.setItem("scores", JSON.stringify(scores));
  }, [scores]);

  // Simpan status modul jika berubah
  useEffect(() => {
    localStorage.setItem("completedModules", JSON.stringify(completedModules));
  }, [completedModules]);

    const resetProgress = () => {
      localStorage.removeItem("scores");
      localStorage.removeItem("completedModules");

      setScores({ perkalian:0, pembagian:0, cerita:0 });
      setCompletedModules({ perkalian:false, pembagian:false, cerita:false });
    };
  // ==========================
  // 🎨 RENDER VIEW
  // ==========================
  function renderView() {
    // ======================
    // 🏝 MENU UTAMA
    // ======================
    if (view === "menu") {
      return (
        <div
          className="fixed inset-0 bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
          style={{
            backgroundImage: "url('/assets/images/latihan_bg.png')",
          }}
        >
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 border-4 border-[#394b23] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
            style={{ maxHeight: "85vh" }}
          >
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-center">
              <h1
                className="text-3xl sm:text-4xl font-extrabold mb-4"
                style={{
                  fontFamily: "'Bungee', cursive",
                  color: "#394b23",
                  textShadow: "2px 2px #9fc66b",
                }}
              >
                Selamat Datang, {player?.name || "Petualang Cilik"}! 🦕
              </h1>

              <p
                className="text-base sm:text-lg font-semibold leading-relaxed text-[#394b23]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Yuk mulai petualangan berhitungmu! 🌿  
                Di sini kamu bisa belajar <b>perkalian</b>, <b>pembagian</b>, dan <b>soal cerita</b>.  
                Jawablah dengan semangat dan jangan menyerah ya! 💪
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#7ea356] hover:bg-[#6a8e46] text-white font-extrabold py-3 rounded-2xl shadow-md border-2 border-[#394b23]"
                  onClick={() => {
                    setView("perkalian");
                    setPerkalianStep(0);

                  // ketika user mulai lagi dari step 0
                  if (perkalianStep === 0 && !completedModules.perkalian) {
                    setScores(prev => ({ ...prev, perkalian: 0 }));
                  }
                  }}
                >
                  📗 Materi Perkalian
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: completedModules.perkalian ? 1.05 : 1,
                  }}
                  whileTap={{
                    scale: completedModules.perkalian ? 0.95 : 1,
                  }}
                  disabled={!completedModules.perkalian}
                  onClick={() => {
                    if (completedModules.perkalian) {
                      setView("pembagian");
                      setPembagianStep(0);
                      // ketika user mulai lagi dari step 0
                    if (pembagianStep === 0 && !completedModules.pembagian) {
                        setScores(prev => ({ ...prev, pembagian: 0 }));
                    }

                    }
                  }}
                  className={`font-extrabold py-3 rounded-2xl shadow-md border-2 ${
                    completedModules.perkalian
                      ? "bg-[#5fa3c7] text-white border-[#394b23]"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed border-gray-500"
                  }`}
                >
                  📘 Materi Pembagian
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: completedModules.pembagian ? 1.05 : 1,
                  }}
                  whileTap={{
                    scale: completedModules.pembagian ? 0.95 : 1,
                  }}
                  disabled={!completedModules.pembagian}
                  onClick={() => {
                    if (completedModules.pembagian) {
                      setView("cerita");
                      setCeritaStep(0);
                      // ketika user mulai lagi dari step 0
                    if (CeritaStep === 0 && !completedModules.cerita) {
                      setScores(prev => ({ ...prev, cerita: 0 }));
                    }

                    }
                  }}
                  className={`font-extrabold py-3 rounded-2xl shadow-md border-2 ${
                    completedModules.pembagian
                      ? "bg-[#f7c748] text-white border-[#394b23]"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed border-gray-500"
                  }`}
                >
                  📙 Soal Cerita
                </motion.button>

                <motion.button
                  whileHover={{
                    scale:
                      completedModules.perkalian &&
                      completedModules.pembagian &&
                      completedModules.cerita
                        ? 1.05
                        : 1,
                  }}
                  whileTap={{
                    scale:
                      completedModules.perkalian &&
                      completedModules.pembagian &&
                      completedModules.cerita
                        ? 0.95
                        : 1,
                  }}
                  disabled={
                    !(
                      completedModules.perkalian &&
                      completedModules.pembagian &&
                      completedModules.cerita
                    )
                  }
                  onClick={() => setView("rekap")}
                  className={`font-extrabold py-3 rounded-2xl shadow-md border-2 ${
                    completedModules.perkalian &&
                    completedModules.pembagian &&
                    completedModules.cerita
                      ? "bg-[#b27cc5] text-white border-[#394b23]"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed border-gray-500"
                  }`}
                >
                  🧾 Rekap Hasil
                </motion.button>
              </div>
            </div>

            {/* tombol bawah tengah */}
            <div className="border-t border-[#394b23] bg-white/80 py-4 flex flex-col items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-xl border border-[#394b23]"
              >
                ⬅ Kembali
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
    }

    // ======================
    // 📗 PERKALIAN VIEW
    // ======================
    if (view === "perkalian") {
      const current = perkalianSteps[perkalianStep];

      if (!current) {
        markCompleted("perkalian", perkalianScore);
        handleBackToMenu();
        return null;
      }

      // === Step Materi ===
      if (current.type === "materi") {
        return (
          <div
            className="fixed inset-0 bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundImage: "url('/assets/images/latihan_bg.png')" }}
          >
            <div
              className="bg-[#fff9ed]/90 border-4 border-[#394b23] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
              style={{ maxHeight: "85vh" }}
            >
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-center">
                <h2
                  className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#394b23]"
                  style={{ fontFamily: "'Bungee', cursive" }}
                >
                  {current.title}
                </h2>
                <img
                  src={current.img}
                  alt="Ilustrasi"
                  className="mx-auto rounded-xl border-2 border-[#394b23] mb-4 object-contain"
                  style={{
                    width: "40%",
                    maxWidth: "300px",
                    height: "auto",
                  }}
                />
                <p
                  className="text-base sm:text-lg leading-relaxed text-[#394b23] font-semibold"
                  style={{ fontFamily: "'Poppins', sans-serif",whiteSpace: "pre-line", }}
                >
                  {current.text}
                </p>
              </div>

              {/* Tombol bawah tengah */}
              <div className="border-t border-[#394b23] bg-white/80 py-4 flex flex-col items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPerkalianStep((s) => s + 1)}
                  className="bg-[#7ea356] hover:bg-[#6a8e46] text-white font-bold px-8 py-3 rounded-xl border-2 border-[#394b23]"
                >
                  Lanjut ➜
                </motion.button>

                <button
                  onClick={handleBackToMenu}
                  className="text-sm text-gray-700 hover:text-gray-900 font-semibold underline"
                >
                  ⬅ Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        );
      }

      // === Step Soal (dua kesempatan) ===
      if (current.type === "soal") {
        const handleAnswer = (opt) => {
          // kalau sudah benar atau selesai, stop
          if (showFeedback && perkalianAttempts >= 2) return;

          setPerkalianSelected(opt);

          if (opt === current.correct) {
            // benar!
            setFeedbackMsg("🎉 Hebat! Jawabanmu benar! Yuk lanjut ke latihan berikutnya!");
            setShowFeedback(true);
            setPerkalianScore((s) => s + 15);
            setPerkalianAttempts(2); // tandai selesai
          } else {
            const nextAttempt = perkalianAttempts + 1;
            setPerkalianAttempts(nextAttempt);

            if (nextAttempt === 1) {
              // salah pertama
              setFeedbackMsg("😢 Sayang sekali, jawaban kamu belum tepat. Coba sekali lagi ya!");
            } else {
              // salah kedua
              setFeedbackMsg(
                `💡 Masih salah. Jawaban yang benar adalah ${current.correct}. Jangan menyerah ya! 🌟`
              );
              setShowFeedback(true);
            }
          }
        };

        const nextStep = () => {
          setShowFeedback(false);
          setFeedbackMsg("");
          setPerkalianSelected(null);
          setPerkalianAttempts(0);
          setPerkalianStep((s) => s + 1);
        };

        return (
          <div
            className="fixed inset-0 bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundImage: "url('/assets/images/latihan_bg.png')" }}
          >
            <div
              className="bg-[#fff9ed]/90 border-4 border-[#394b23] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
              style={{ maxHeight: "85vh" }}
            >
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-center">
                <h2
                  className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#394b23]"
                  style={{ fontFamily: "'Bungee', cursive" }}
                >
                  Soal Latihan
                </h2>
                <img
                  src={current.img}
                  alt="Ilustrasi"
                  className="mx-auto rounded-xl border-2 border-[#394b23] mb-4 object-contain"
                  style={{
                    width: "40%",
                    maxWidth: "300px",
                    height: "auto",
                  }}
                />
                <p
                  className="text-base sm:text-lg leading-relaxed text-[#394b23] font-semibold mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {current.question}
                </p>

                <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
                  {current.options.map((opt, i) => {
                    let btnColor = "bg-white text-[#394b23] hover:bg-green-50";
                    if (perkalianSelected === opt && perkalianAttempts === 1 && opt !== current.correct)
                      btnColor = "bg-red-400 text-white"; // salah pertama: merah 1
                    if (perkalianAttempts >= 2 && opt === current.correct)
                      btnColor = "bg-green-500 text-white"; // jawaban benar ditampilkan setelah 2x
                    if (perkalianAttempts >= 2 && opt === perkalianSelected && opt !== current.correct)
                      btnColor = "bg-red-500 text-white"; // salah kedua: merah + hijau benar
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={perkalianAttempts >= 2 && showFeedback}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full px-4 py-3 rounded-xl font-semibold border-2 border-[#394b23] ${btnColor}`}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                {feedbackMsg && (
                  <div className="mt-6 bg-white/80 border border-[#394b23] rounded-xl p-4 shadow-inner">
                    <p
                      className="text-base sm:text-lg font-semibold text-[#394b23]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {feedbackMsg}
                    </p>
                    {showFeedback && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextStep}
                        className="mt-4 bg-[#7ea356] hover:bg-[#6a8e46] text-white font-bold px-6 py-2 rounded-xl border-2 border-[#394b23]"
                      >
                        Lanjut ➜
                      </motion.button>
                    )}
                  </div>
                )}

                <p
                  className="mt-6 text-[#394b23] font-semibold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Skor: {perkalianScore}
                </p>
              </div>

              {/* Tombol bawah tengah */}
              <div className="border-t border-[#394b23] bg-white/80 py-4 flex flex-col items-center gap-2">
                <button
                  onClick={handleBackToMenu}
                  className="text-sm text-gray-700 hover:text-gray-900 font-semibold underline"
                >
                  ⬅ Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        );
      }

      return null;
    }
    // ======================
    // 📘 PEMBAGIAN VIEW
    // ======================
    if (view === "pembagian") {
      const current = pembagianSteps[pembagianStep];
      if (!current) {
        markCompleted("pembagian", pembagianScore);
        handleBackToMenu();
        return null;
      }

      if (current.type === "materi") {
        return (
          <div
            className="fixed inset-0 bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundImage: "url('/assets/images/latihan_bg.png')" }}
          >
            <div
              className="bg-[#fff9ed]/90 border-4 border-[#394b23] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
              style={{ maxHeight: "85vh" }}
            >
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-center">
                <h2
                  className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#394b23]"
                  style={{ fontFamily: "'Bungee', cursive" }}
                >
                  {current.title}
                </h2>
                <img
                  src={current.img}
                  alt="Ilustrasi"
                  className="mx-auto rounded-xl border-2 border-[#394b23] mb-4 object-contain"
                  style={{
                    width: "40%",
                    maxWidth: "300px",
                    height: "auto",
                  }}
                />
                <p
                  className="text-base sm:text-lg leading-relaxed text-[#394b23] font-semibold"
                  style={{ fontFamily: "'Poppins', sans-serif",whiteSpace: "pre-line", }}
                >
                  {current.text}
                </p>
              </div>

              <div className="border-t border-[#394b23] bg-white/80 py-4 flex flex-col items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPembagianStep((s) => s + 1)}
                  className="bg-[#5fa3c7] hover:bg-[#4a8fb0] text-white font-bold px-8 py-3 rounded-xl border-2 border-[#394b23]"
                >
                  Lanjut ➜
                </motion.button>

                <button
                  onClick={handleBackToMenu}
                  className="text-sm text-gray-700 hover:text-gray-900 font-semibold underline"
                >
                  ⬅ Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        );
      }

      // === Step Soal ===
      if (current.type === "soal") {
        const handleAnswer = (opt) => {
          if (showFeedback && pembagianAttempts >= 2) return;
          setPembagianSelected(opt);

          if (opt === current.correct) {
            setFeedbackMsg("🎉 Hebat! Jawabanmu benar! Yuk lanjut ke latihan berikutnya!");
            setShowFeedback(true);
            setPembagianScore((s) => s + 15);
            setPembagianAttempts(2);
          } else {
            const nextAttempt = pembagianAttempts + 1;
            setPembagianAttempts(nextAttempt);

            if (nextAttempt === 1) {
              setFeedbackMsg("😢 Sayang sekali, jawaban kamu belum tepat. Coba sekali lagi ya!");
            } else {
              setFeedbackMsg(
                `💡 Masih salah. Jawaban yang benar adalah ${current.correct}. Jangan menyerah ya! 🌟`
              );
              setShowFeedback(true);
            }
          }
        };

        const nextStep = () => {
          setShowFeedback(false);
          setFeedbackMsg("");
          setPembagianSelected(null);
          setPembagianAttempts(0);
          setPembagianStep((s) => s + 1);
        };

        return (
          <div
            className="fixed inset-0 bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundImage: "url('/assets/images/latihan_bg.png')" }}
          >
            <div
              className="bg-[#fff9ed]/90 border-4 border-[#394b23] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
              style={{ maxHeight: "85vh" }}
            >
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-center">
                <h2
                  className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#394b23]"
                  style={{ fontFamily: "'Bungee', cursive" }}
                >
                  Soal Pembagian
                </h2>
                <img
                  src={current.img}
                  alt="Ilustrasi"
                  className="mx-auto rounded-xl border-2 border-[#394b23] mb-4 object-contain"
                  style={{
                    width: "40%",
                    maxWidth: "300px",
                    height: "auto",
                  }}
                />
                <p
                  className="text-base sm:text-lg leading-relaxed text-[#394b23] font-semibold mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {current.question}
                </p>

                <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
                  {current.options.map((opt, i) => {
                    let btnColor = "bg-white text-[#394b23] hover:bg-blue-50";
                    if (pembagianSelected === opt && pembagianAttempts === 1 && opt !== current.correct)
                      btnColor = "bg-red-400 text-white";
                    if (pembagianAttempts >= 2 && opt === current.correct)
                      btnColor = "bg-green-500 text-white";
                    if (pembagianAttempts >= 2 && opt === pembagianSelected && opt !== current.correct)
                      btnColor = "bg-red-500 text-white";

                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={pembagianAttempts >= 2 && showFeedback}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full px-4 py-3 rounded-xl font-semibold border-2 border-[#394b23] ${btnColor}`}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                {feedbackMsg && (
                  <div className="mt-6 bg-white/80 border border-[#394b23] rounded-xl p-4 shadow-inner">
                    <p
                      className="text-base sm:text-lg font-semibold text-[#394b23]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {feedbackMsg}
                    </p>
                    {showFeedback && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextStep}
                        className="mt-4 bg-[#5fa3c7] hover:bg-[#4a8fb0] text-white font-bold px-6 py-2 rounded-xl border-2 border-[#394b23]"
                      >
                        Lanjut ➜
                      </motion.button>
                    )}
                  </div>
                )}
                <p
                  className="mt-6 text-[#394b23] font-semibold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Skor: {pembagianScore}
                </p>
              </div>

              <div className="border-t border-[#394b23] bg-white/80 py-4 flex flex-col items-center gap-2">
                <button
                  onClick={handleBackToMenu}
                  className="text-sm text-gray-700 hover:text-gray-900 font-semibold underline"
                >
                  ⬅ Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        );
      }
      return null;
    }

    // ======================
    // 📙 CERITA VIEW
    // ======================
    if (view === "cerita") {
      const current = ceritaSteps[ceritaStep];
      if (!current) {
        markCompleted("cerita", ceritaScore);
        handleBackToMenu();
        return null;
      }

      if (current.type === "materi") {
        return (
          <div
            className="fixed inset-0 bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundImage: "url('/assets/images/latihan_bg.png')" }}
          >
            <div
              className="bg-[#fff9ed]/90 border-4 border-[#394b23] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
              style={{ maxHeight: "85vh" }}
            >
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-center">
                <h2
                  className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#394b23]"
                  style={{ fontFamily: "'Bungee', cursive" }}
                >
                  {current.title}
                </h2>
                <img
                  src={current.img}
                  alt="Ilustrasi"
                  className="mx-auto rounded-xl border-2 border-[#394b23] mb-4 object-contain"
                  style={{
                    width: "40%",
                    maxWidth: "300px",
                    height: "auto",
                  }}
                />
                <p
                  className="text-base sm:text-lg leading-relaxed text-[#394b23] font-semibold"
                  style={{ fontFamily: "'Poppins', sans-serif",whiteSpace: "pre-line", }}
                >
                  {current.text}
                </p>
              </div>

              <div className="border-t border-[#394b23] bg-white/80 py-4 flex flex-col items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCeritaStep((s) => s + 1)}
                  className="bg-[#f7c748] hover:bg-[#e0b63f] text-white font-bold px-8 py-3 rounded-xl border-2 border-[#394b23]"
                >
                  Lanjut ➜
                </motion.button>

                <button
                  onClick={handleBackToMenu}
                  className="text-sm text-gray-700 hover:text-gray-900 font-semibold underline"
                >
                  ⬅ Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        );
      }

      // === Step Soal Cerita ===
      if (current.type === "soal") {
        const handleAnswer = (opt) => {
          if (showFeedback && ceritaAttempts >= 2) return;
          setCeritaSelected(opt);

          if (opt === current.correct) {
            setFeedbackMsg("🎉 Hebat! Jawabanmu benar! Yuk lanjut ke latihan berikutnya!");
            setShowFeedback(true);
            setCeritaScore((s) => s + 10);
            setCeritaAttempts(2);
          } else {
            const nextAttempt = ceritaAttempts + 1;
            setCeritaAttempts(nextAttempt);

            if (nextAttempt === 1) {
              setFeedbackMsg("😢 Sayang sekali, jawaban kamu belum tepat. Coba sekali lagi ya!");
            } else {
              setFeedbackMsg(
                `💡 Masih salah. Jawaban yang benar adalah ${current.correct}. Jangan menyerah ya! 🌟`
              );
              setShowFeedback(true);
            }
          }
        };

        const nextStep = () => {
          setShowFeedback(false);
          setFeedbackMsg("");
          setCeritaSelected(null);
          setCeritaAttempts(0);
          setCeritaStep((s) => s + 1);
        };

        return (
          <div
            className="fixed inset-0 bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundImage: "url('/assets/images/latihan_bg.png')" }}
          >
            <div
              className="bg-[#fff9ed]/90 border-4 border-[#394b23] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
              style={{ maxHeight: "85vh" }}
            >
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-center">
                <h2
                  className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#394b23]"
                  style={{ fontFamily: "'Bungee', cursive" }}
                >
                  Soal Cerita
                </h2>
                <img
                  src={current.img}
                  alt="Ilustrasi"
                  className="mx-auto rounded-xl border-2 border-[#394b23] mb-4 object-contain"
                  style={{
                    width: "40%",
                    maxWidth: "300px",
                    height: "auto",
                  }}
                />
                <p
                  className="text-base sm:text-lg leading-relaxed text-[#394b23] font-semibold mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {current.question}
                </p>

                <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
                  {current.options.map((opt, i) => {
                    let btnColor = "bg-white text-[#394b23] hover:bg-yellow-50";
                    if (ceritaSelected === opt && ceritaAttempts === 1 && opt !== current.correct)
                      btnColor = "bg-red-400 text-white";
                    if (ceritaAttempts >= 2 && opt === current.correct)
                      btnColor = "bg-green-500 text-white";
                    if (ceritaAttempts >= 2 && opt === ceritaSelected && opt !== current.correct)
                      btnColor = "bg-red-500 text-white";

                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={ceritaAttempts >= 2 && showFeedback}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full px-4 py-3 rounded-xl font-semibold border-2 border-[#394b23] ${btnColor}`}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                {feedbackMsg && (
                  <div className="mt-6 bg-white/80 border border-[#394b23] rounded-xl p-4 shadow-inner">
                    <p
                      className="text-base sm:text-lg font-semibold text-[#394b23]"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {feedbackMsg}
                    </p>
                    {showFeedback && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextStep}
                        className="mt-4 bg-[#f7c748] hover:bg-[#e0b63f] text-white font-bold px-6 py-2 rounded-xl border-2 border-[#394b23]"
                      >
                        Lanjut ➜
                      </motion.button>
                    )}
                  </div>
                )}
                <p
                  className="mt-6 text-[#394b23] font-semibold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Skor: {ceritaScore}
                </p>
              </div>

              <div className="border-t border-[#394b23] bg-white/80 py-4 flex flex-col items-center gap-2">
                <button
                  onClick={handleBackToMenu}
                  className="text-sm text-gray-700 hover:text-gray-900 font-semibold underline"
                >
                  ⬅ Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        );
      }
      return null;
    }

    // ======================
    // 🧾 REKAP HASIL
    // ======================
    if (view === "rekap") {
      return (
        <div
          className="fixed inset-0 bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundImage: "url('/assets/images/latihan_bg.png')" }}
        >
          <div
            className="bg-white/90 border-4 border-[#394b23] rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col"
            style={{ maxHeight: "85vh" }}
          >
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-center">
              <h2
                className="text-3xl font-extrabold text-[#394b23] mb-4"
                style={{ fontFamily: "'Bungee', cursive" }}
              >
                Rekap Petualanganmu 🎉
              </h2>
              <p
                className="text-base sm:text-lg leading-relaxed text-[#394b23] font-semibold mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Wah, seru banget perjalananmu! Yuk lihat hasil dari setiap
                tantangan yang sudah kamu selesaikan:
              </p>
              <div className="bg-[#fff3d9] border-2 border-[#394b23] rounded-2xl p-4 text-left">
                <p>📗 Perkalian: <b>{scores.perkalian}</b> poin</p>
                <p>📘 Pembagian: <b>{scores.pembagian}</b> poin</p>
                <p>📙 Soal Cerita: <b>{scores.cerita}</b> poin</p>
                <hr className="my-2 border-[#394b23]" />
                <p className="text-lg font-bold text-[#394b23]">
                  Total Skor: {scores.perkalian + scores.pembagian + scores.cerita}
                </p>
              </div>
            </div>

            <div className="border-t border-[#394b23] bg-white/80 py-4 flex flex-col items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToMenu}
                className="bg-[#7ea356] hover:bg-[#6a8e46] text-white font-bold px-8 py-3 rounded-xl border-2 border-[#394b23]"
              >
                ⬅ Kembali ke Menu Utama
              </motion.button>
              <button
                onClick={resetProgress}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 rounded-xl border-2 border-[#394b23]"
              >
                🔄 Reset Progress
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  return <>{renderView()}</>;
}

