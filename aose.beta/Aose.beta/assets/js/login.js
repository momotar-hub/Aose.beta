document.addEventListener('DOMContentLoaded', () => {
    const passwordForm = document.getElementById('password-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');

    // ★ 部員ごとの個別アカウント（ユーザー名: パスワード）
    // 必要に応じて部員の名前とパスワードを書き換えてください
    const USER_ACCOUNTS = {
        "廣瀬もも": "momotar30atr",
        "森柑奈": 
        "kanna0611"
    };

    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // ユーザー名が存在し、かつパスワードが一致するか
        if (USER_ACCOUNTS[username] && USER_ACCOUNTS[username] === password) {
            // セッションにログイン情報と部員名を保存
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('currentUser', username);
            
            errorMessage.classList.remove('show');
            window.location.href = 'index.html'; // トップページへ
        } else {
            errorMessage.textContent = 'ユーザー名またはパスワードが違います。';
            errorMessage.classList.add('show');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
});