// 🔹 ตรวจสอบและกำหนดค่าหลังจากโหลด DOM
document.addEventListener("DOMContentLoaded", function () {
    setupActiveNav();      // กำหนดเมนู Navbar ที่ active
    setupDarkMode();       // ตั้งค่า Dark Mode
    setupLoginSystem();    // จัดการระบบล็อกอิน
    setupScrollToTop();    // ตั้งค่าปุ่มกลับไปด้านบน
});

// ====================================================
// 🔹 ฟังก์ชันกำหนดเมนู Navbar ที่ active ตามหน้าเว็บปัจจุบัน
// ====================================================
function setupActiveNav() {
    let navLinks = document.querySelectorAll(".nav-link");
    let currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
}

// ====================================================
// 🔹 ฟังก์ชันตั้งค่า Dark Mode และจำค่าด้วย LocalStorage
// ====================================================
function setupDarkMode() {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // ตรวจสอบสถานะ Dark Mode ที่เคยบันทึกไว้
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        darkModeToggle.textContent = "☀️"; // เปลี่ยนเป็นไอคอนพระอาทิตย์
    }

    // เมื่อกดปุ่มเปลี่ยนโหมด
    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.textContent = "☀️";
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.textContent = "🌙";
        }
    });
}

// ====================================================
// 🔹 ฟังก์ชันจัดการระบบล็อกอิน
// ====================================================
function setupLoginSystem() {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const bmiMenu = document.getElementById("bmiMenu");
    const signInBtn = document.getElementById("signInBtn");
    const signOutBtn = document.getElementById("signOutBtn");
    const loginModalEl = document.getElementById("loginModal");

    // ตรวจสอบสถานะล็อกอินที่บันทึกไว้
    if (localStorage.getItem("loggedIn") === "true") {
        bmiMenu.style.display = "block";  // แสดงเมนู BMI
        signInBtn.style.display = "none"; // ซ่อนปุ่ม Sign In
        signOutBtn.style.display = "block"; // แสดงปุ่ม Sign Out
    }

    // ตรวจสอบว่ามีฟอร์มล็อกอินหรือไม่ (ป้องกัน Error ในบางหน้า)
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = usernameInput.value;
            const password = passwordInput.value;

            // ตรวจสอบ Username และ Password
            if (username === "test" && password === "password") {
                Swal.fire({
                    title: "เข้าสู่ระบบสำเร็จ!",
                    text: "ยินดีต้อนรับเข้าสู่ระบบ",
                    icon: "success",
                    showConfirmButton: true,
                    confirmButtonColor: "#3085d6",
                    showClass: {
                        popup: "animate__animated animate__zoomIn"
                    },
                    hideClass: {
                        popup: "animate__animated animate__zoomOut"
                    }
                });
                
                localStorage.setItem("loggedIn", "true");

                bmiMenu.style.display = "block";  // แสดงเมนู BMI
                signInBtn.style.display = "none"; // ซ่อนปุ่ม Sign In
                signOutBtn.style.display = "block"; // แสดงปุ่ม Sign Out

                closeModal(loginModalEl); // ปิด Modal ล็อกอิน
            } else {
                alert("Username หรือ Password ไม่ถูกต้อง!");
            }
        });
    }

    // ฟังก์ชัน Logout
    signOutBtn.addEventListener("click", function () {
        Swal.fire({
            title: "ออกจากระบบสำเร็จ!",
            text: "แล้วพบกันใหม่",
            icon: "success",
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
            showClass: {
                popup: "animate__animated animate__zoomIn"
            },
            hideClass: {
                popup: "animate__animated animate__zoomOut"
            }
        });
        localStorage.removeItem("loggedIn");

        bmiMenu.style.display = "none";  // ซ่อนเมนู BMI
        signInBtn.style.display = "block"; // แสดงปุ่ม Sign In
        signOutBtn.style.display = "none"; // ซ่อนปุ่ม Sign Out
    });
}

// ====================================================
// 🔹 ฟังก์ชันปิด Modal
// ====================================================
function closeModal(modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.hide();
    modalElement.classList.remove("show");
    document.body.classList.remove("modal-open");
    document.querySelectorAll(".modal-backdrop").forEach(e => e.remove()); // ลบ Backdrop ที่อาจซ้ำ
}
// ===========================
// 🔹 ฟังก์ชันคำนวณ BMI
// ===========================
function calculateBMI() {
  let weight = parseFloat(document.getElementById("weight").value);
  let height = parseFloat(document.getElementById("height").value);
  let mealPlanLink = document.getElementById("mealPlanLink");

  if (!weight || !height) {
    alert("กรุณากรอกน้ำหนักและส่วนสูงให้ครบ");
    return;
  }

  let heightInMeters = height / 100;
  let bmi = weight / (heightInMeters * heightInMeters);

  let bmiCategory = "";
  let weightSuggestion = "";
  let calorieIntake = "";
  let mealPlanURL = "";

  let bmr = weight * 24; // คำนวณค่า BMR (Basal Metabolic Rate)

  if (bmi < 18.5) {
    bmiCategory = "น้ำหนักต่ำกว่าเกณฑ์ (ผอม)";
    weightSuggestion = "คุณควรเพิ่มน้ำหนักเพื่อสุขภาพที่ดีขึ้น";
    calorieIntake = `🍛 ควรกินเพิ่มวันละประมาณ ${bmr + 500} kcal เพื่อเพิ่มน้ำหนัก`;
    mealPlanURL = "meal_plan_underweight.html"; // ลิงก์ไปหน้าตารางอาหารสำหรับผู้ที่ผอม
  } else if (bmi >= 18.5 && bmi < 24.9) {
    bmiCategory = "น้ำหนักปกติ (สุขภาพดี)";
    weightSuggestion = "คุณมีน้ำหนักอยู่ในเกณฑ์ที่ดีแล้ว!";
    calorieIntake = `🔥 ควรกินวันละประมาณ ${bmr} kcal เพื่อรักษาน้ำหนัก`;
    mealPlanURL = "meal_plan_normal.html"; // ลิงก์ไปหน้าตารางอาหารสำหรับคนปกติ
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = "น้ำหนักเกิน (เริ่มมีความเสี่ยง)";
    weightSuggestion = "คุณควรลดน้ำหนักเพื่อสุขภาพที่ดีขึ้น";
    calorieIntake = `🥗 ควรกินลดลงวันละประมาณ ${bmr - 500} kcal เพื่อค่อยๆ ลดน้ำหนัก`;
    mealPlanURL = "meal_plan_overweight.html"; // ลิงก์ไปหน้าตารางอาหารสำหรับคนที่น้ำหนักเกิน
  } else {
    bmiCategory = "อ้วน (มีความเสี่ยงสูง)";
    weightSuggestion = "คุณควรลดน้ำหนักเพื่อลดความเสี่ยงต่อโรค";
    calorieIntake = `🥦 ควรกินลดลงวันละประมาณ ${bmr - 700} kcal เพื่อช่วยลดน้ำหนักเร็วขึ้น`;
    mealPlanURL = "meal_plan_obese.html"; // ลิงก์ไปหน้าตารางอาหารสำหรับคนที่อ้วน
  }

  document.getElementById("bmiResult").textContent = `📏 BMI ของคุณ: ${bmi.toFixed(2)}`;
  document.getElementById("bmiCategory").textContent = `📌 หมวดหมู่: ${bmiCategory}`;
  document.getElementById("weightSuggestion").textContent = `💡 คำแนะนำ: ${weightSuggestion}`;
  document.getElementById("calorieIntake").textContent = `⚡ ${calorieIntake}`;

  // แสดงลิงก์ไปตารางอาหารเฉพาะเมื่อคำนวณ BMI สำเร็จ
  if (mealPlanURL) {
    mealPlanLink.href = mealPlanURL;
    mealPlanLink.style.display = "inline-block";
  } else {
    mealPlanLink.style.display = "none";
  }
}

// ====================================================
// 🔹 ฟังก์ชันแสดงปุ่ม "กลับไปด้านบน" เมื่อเลื่อนลง
// ====================================================
function setupScrollToTop() {
    window.onscroll = function () {
        let btn = document.getElementById("backToTopBtn");
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            btn.style.display = "flex";
        } else {
            btn.style.display = "none";
        }
    };
}

// ====================================================
// 🔹 ฟังก์ชันเลื่อนกลับไปด้านบน
// ====================================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
   // 🔹 ฟังก์ชันซ่อน-แสดง Floating Social Buttons
   function toggleSocialButtons() {
    let socialButtons = document.querySelector('.floating-social');
    socialButtons.style.display = (socialButtons.style.display === 'none') ? 'flex' : 'none';
   }
// ====================================================
// 🔹 ฟังก์ชันเลื่อนกลับไปด้านบน
// ====================================================
document.addEventListener("DOMContentLoaded", function () {
    const chatToggle = document.getElementById("chatToggle");
    const chatContainer = document.getElementById("chatContainer");
    const closeChat = document.getElementById("closeChat");
    const chatInput = document.getElementById("chatInput");
    const sendMessage = document.getElementById("sendMessage");
    const chatBody = document.getElementById("chatBody");

    // 🔹 เปิด-ปิดแชท
    chatToggle.addEventListener("click", () => {
        chatContainer.style.display = "flex";
    });

    closeChat.addEventListener("click", () => {
        chatContainer.style.display = "none";
    });

    // 📝 ส่งข้อความและให้บอทตอบกลับ
    function sendMessageFunc() {
        const message = chatInput.value.trim();
        if (message === "") return;

        // 📩 แสดงข้อความผู้ใช้
        const userMessage = document.createElement("div");
        userMessage.textContent = message;
        userMessage.classList.add("user-message");
        chatBody.appendChild(userMessage);
        chatInput.value = "";

        // ⏳ รอ 1 วิ ก่อนให้บอทตอบกลับ
        setTimeout(() => {
            const botMessage = document.createElement("div");
            botMessage.classList.add("bot-message");

            // 🧠 ตั้งค่าการตอบกลับของบอท
            let reply;
            if (message.includes("สวัสดี")) {
                reply = "สวัสดีค่ะ! ต้องการให้ช่วยอะไร?";
            } else if (message.includes("สุขภาพ")) {
                reply = "คุณต้องการคำแนะนำด้านสุขภาพอะไร?";
            } else if (message.includes("ควรเริ่มจากอะไรดี")) {
                reply = "เริ่มจากการล็อกอินเพื่อใช้งานฟังก์ชันคำนวนบีเอ็มไอก่อนอันดับแรกเลย";
            } else {
                reply = "ขอโทษค่ะ ฉันไม่เข้าใจ ลองพิมพ์คำถามอื่นได้นะ!";
            }

            botMessage.textContent = reply;
            chatBody.appendChild(botMessage);
            chatBody.scrollTop = chatBody.scrollHeight; // 📜 เลื่อนลงอัตโนมัติ
        }, 1000);
    }

    sendMessage.addEventListener("click", sendMessageFunc);
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessageFunc();
    });
});
