// account.js

document.addEventListener("DOMContentLoaded", async function () {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    // Если нет access token, перенаправляем на главную страницу или показываем сообщение
    alert("Пожалуйста, войдите в систему.");
    window.location.href = "index.html";
    return;
  }

  // Функция для получения информации о пользователе
  async function getUserInfo() {
    try {
      const response = await fetch("http://localhost:8081/user/account/", {
        method: "GET",
        credentials: "include", // Включает передачу куки для refresh token
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Заполнение данных пользователя
        document.getElementById("user-email").value = data.email;
        document.getElementById("api-key").value = data.api_key;
      } else {
        const errorData = await response.json();
        if (errorData.error === "invalid token") {
          // Пытаемся обновить токен
          const refreshSuccessful = await refreshToken();
          if (refreshSuccessful) {
            // Повторяем запрос информации о пользователе
            await getUserInfo();
          } else {
            alert("Пожалуйста, выполните вход в систему.");
            localStorage.removeItem("accessToken");
            updateAuthButtons();
            window.location.href = "index.html";
            //
          }
        } else {
          alert(`Ошибка: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.error("Ошибка при получении информации о пользователе:", error);
      alert("Произошла ошибка при получении информации о пользователе.");
    }
  }

  // Функция для обновления access token
  async function refreshToken() {
    try {
      const response = await fetch(
        "http://localhost:8081/user/login/refresh/",
        {
          method: "POST",
          credentials: "include", // Включает передачу куки с refresh token
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access_token;
        if (newAccessToken) {
          // Сохраняем новый access token
          localStorage.setItem("accessToken", newAccessToken);
          return true;
        } else {
          return false;
        }
      } else {
        const errorData = await response.json();
        alert(`Ошибка обновления токена: ${errorData.error}`);
        return false;
      }
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      return false;
    }
  }

  // Получаем информацию о пользователе
  await getUserInfo();
});
function updateAuthButtons() {
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = accessToken !== null;

  if (isLoggedIn) {
    authBtn.textContent = "Выйти";
    document.getElementById("my-account-link").style.display = "block";
  } else {
    authBtn.textContent = "Войти";
    document.getElementById("my-account-link").style.display = "none";
  }
}
