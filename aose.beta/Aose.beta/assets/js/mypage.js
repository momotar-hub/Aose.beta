document.addEventListener('DOMContentLoaded', () => {
    // ログイン中の部員名を取得
    const currentUser = sessionStorage.getItem('currentUser') || 'ゲスト部員';
    document.getElementById('welcome-message').textContent = `こんにちは、${currentUser} さん`;

    // LocalStorageのキー（大会実績は部員ごとにユニークにする）
    const ACHIEVEMENT_KEY = `achievements_${currentUser}`;
    const DIARY_KEY = 'diaries'; // diary.htmlのデータ保存キーと合わせる

    // DOM要素
    const totalSailingCountEl = document.getElementById('total-sailing-count');
    const myDiaryListEl = document.getElementById('my-diary-list');
    const achievementForm = document.getElementById('achievement-form');
    const achievementInput = document.getElementById('achievement-input');
    const achievementListEl = document.getElementById('achievement-list');

    // ==========================================
    // 1. 自分の乗艇日誌の抽出 ＆ バッジのアンロック判定
    // ==========================================
    function loadMyDiaries() {
        const allDiaries = JSON.parse(localStorage.getItem(DIARY_KEY)) || [];
        
        // 自分が作成者（author または name）になっている日誌だけをフィルター
        const myDiaries = allDiaries.filter(diary => diary.author === currentUser || diary.name === currentUser);

        // 乗艇回数（日誌の件数）を表示
        const count = myDiaries.length;
        totalSailingCountEl.textContent = count;

        // 回数に応じてバッジをアクティブにする
        if (count >= 1)  document.getElementById('badge-1').classList.add('unlocked');
        if (count >= 5)  document.getElementById('badge-5').classList.add('unlocked');
        if (count >= 10) document.getElementById('badge-10').classList.add('unlocked');

        // 日誌一覧を表示
        if (myDiaries.length === 0) {
            myDiaryListEl.innerHTML = '<p style="color:#888; font-size:0.9rem;">まだあなたの書いた乗艇日誌がありません。「乗艇日誌」ページから投稿してみましょう！</p>';
            return;
        }

        myDiaryListEl.innerHTML = myDiaries.map(diary => `
            <div class="my-diary-item">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:#666; font-size:0.85rem;">
                    <span>📅 日付: ${diary.date || '未設定'}</span>
                    <span>⛵ 天候/コンディション: ${diary.weather || diary.condition || '未設定'}</span>
                </div>
                <p style="margin: 0; color: #333; line-height: 1.5; white-space: pre-wrap;">${diary.content || diary.text || ''}</p>
            </div>
        `).join('');
    }

    // ==========================================
    // 2. 部員ごとの大会実績管理（追加・削除）
    // ==========================================
    function loadAchievements() {
        const achievements = JSON.parse(localStorage.getItem(ACHIEVEMENT_KEY)) || [];
        
        if (achievements.length === 0) {
            achievementListEl.innerHTML = '<p style="color:#888; font-size:0.9rem;">登録された実績がありません。上のフォームから追加してください。</p>';
            return;
        }

        achievementListEl.innerHTML = achievements.map((ach, index) => `
            <div class="achievement-item">
                <span>🏅 ${ach}</span>
                <button class="delete-ach-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `).join('');

        // 削除ボタンへのイベント割り当て
        document.querySelectorAll('.delete-ach-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                deleteAchievement(index);
            });
        });
    }

    // 実績の追加
    achievementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = achievementInput.value.trim();
        if (!text) return;

        const achievements = JSON.parse(localStorage.getItem(ACHIEVEMENT_KEY)) || [];
        achievements.push(text);
        localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(achievements));

        achievementInput.value = '';
        loadAchievements();
    });

    // 実績の削除
    function deleteAchievement(index) {
        const achievements = JSON.parse(localStorage.getItem(ACHIEVEMENT_KEY)) || [];
        achievements.splice(index, 1);
        localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(achievements));
        loadAchievements();
    }

    // ページ読み込み時に実行
    loadMyDiaries();
    loadAchievements();
});