// CASINO TÀI XỈU 3D VIP - GAME ENGINE & LOGIC

document.addEventListener("DOMContentLoaded", () => {
    // --- GAME STATE VARIABLES ---
    let timerValue = 30;
    let timerInterval = null;
    let gameState = "BETTING"; // "BETTING", "LOCKED", "SHAKING", "REVEAL", "RESULT"
    let roundNumber = 888888 + Math.floor(Math.random() * 1000);

    // User / Account State (Updated Admin credentials: admin / hvk@123)
    let usersDb = {
        "admin": { password: "hvk@123", balance: 999999999999, isUnlimited: true, role: "ADMIN" },
        "DaiGia888": { password: "123", balance: 5000000, isUnlimited: false, role: "VIP" }
    };

    let currentUser = usersDb["admin"];
    let currentUsername = "admin";
    let selectedChipValue = 5000;

    // User Current Bets
    let userBetXiu = 0;
    let userBetTai = 0;

    // Total Pool Bets (Simulated Live Players + User)
    let totalPoolXiu = 0;
    let totalPoolTai = 0;
    let playersXiu = 0;
    let playersTai = 0;

    // Admin Cheat Control ('auto', 'tai', 'xiu')
    let forcedResult = 'auto';

    // Dice Results
    let diceResult = [1, 3, 5];
    let diceSum = 9;
    let isTaiResult = false;

    // History
    let gameHistory = [];
    let depositHistory = [];

    // --- DOM ELEMENTS ---
    const timerText = document.getElementById("timer-text");
    const timerPath = document.getElementById("timer-path");
    const gameStatusText = document.getElementById("game-status-text");
    const roundNumberText = document.getElementById("round-number");

    // Header Profile DOM
    const usernameDisplay = document.getElementById("username-display");
    const userBadge = document.getElementById("user-badge");
    const userBalanceText = document.getElementById("user-balance");
    const crownIcon = document.getElementById("crown-icon");

    const boxXiu = document.getElementById("box-xiu");
    const boxTai = document.getElementById("box-tai");

    const myXiuBetText = document.getElementById("my-xiu-bet");
    const myTaiBetText = document.getElementById("my-tai-bet");

    const xiuTotalMoneyText = document.getElementById("xiu-total-money");
    const taiTotalMoneyText = document.getElementById("tai-total-money");
    const xiuTotalPlayersText = document.getElementById("xiu-total-players");
    const taiTotalPlayersText = document.getElementById("tai-total-players");

    const bowl = document.getElementById("bowl");
    const btnReveal = document.getElementById("btn-reveal");
    const resultOverlay = document.getElementById("result-overlay");
    const sumBadge = document.getElementById("sum-badge");
    const resultTitle = document.getElementById("result-title");

    const chips = document.querySelectorAll(".chip");
    const btnClearBet = document.getElementById("btn-clear-bet");
    const btnDoubleBet = document.getElementById("btn-double-bet");
    const btnAllinBet = document.getElementById("btn-allin-bet");

    const historyList = document.getElementById("history-list");
    const statTaiCount = document.getElementById("stat-tai-count");
    const statXiuCount = document.getElementById("stat-xiu-count");

    // QUICK TOP ACTION BAR
    const btnQuickDeposit = document.getElementById("btn-quick-deposit");
    const btnQuickAuth = document.getElementById("btn-quick-auth");
    const btnQuickAdminTool = document.getElementById("btn-quick-admin-tool");
    const quickAuthLabel = document.getElementById("quick-auth-label");

    // AUTH MODAL DOM
    const btnOpenAuth = document.getElementById("btn-open-auth");
    const btnCloseAuth = document.getElementById("btn-close-auth");
    const authModal = document.getElementById("auth-modal");
    const tabLoginBtn = document.getElementById("tab-login-btn");
    const tabRegisterBtn = document.getElementById("tab-register-btn");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loggedInBox = document.getElementById("logged-in-box");
    const btnQuickAdminLogin = document.getElementById("btn-quick-admin-login");
    const btnLogout = document.getElementById("btn-logout");

    const detailUsername = document.getElementById("detail-username");
    const detailBalance = document.getElementById("detail-balance");

    // DEPOSIT MODAL DOM
    const btnOpenDeposit = document.getElementById("btn-open-deposit");
    const btnCloseDeposit = document.getElementById("btn-close-deposit");
    const depositModal = document.getElementById("deposit-modal");
    const depTabBtns = document.querySelectorAll(".dep-tab-btn");
    const bankContentText = document.getElementById("bank-content-text");
    const cardDepositForm = document.getElementById("card-deposit-form");
    const depHistList = document.getElementById("dep-hist-list");
    const packBtns = document.querySelectorAll(".pack-btn");

    // ADMIN MODAL DOM
    const btnOpenAdmin = document.getElementById("btn-open-admin");
    const btnCloseAdmin = document.getElementById("btn-close-admin");
    const adminModal = document.getElementById("admin-modal");
    const toggleUnlimitedMoney = document.getElementById("toggle-unlimited-money");
    const unlimitedStatusText = document.getElementById("unlimited-status-text");
    const cheatHintText = document.getElementById("cheat-hint-text");
    const adminUserName = document.getElementById("admin-user-name");

    const btnCheatAuto = document.getElementById("btn-cheat-auto");
    const btnCheatTai = document.getElementById("btn-cheat-tai");
    const btnCheatXiu = document.getElementById("btn-cheat-xiu");

    const btnAddMoney = document.getElementById("btn-add-money");
    const inputCustomMoney = document.getElementById("input-custom-money");
    const btnResetGame = document.getElementById("btn-reset-game");

    const winToast = document.getElementById("win-toast");
    const winToastAmount = document.getElementById("win-toast-amount");

    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const btnSendChat = document.getElementById("btn-send-chat");

    // --- SOUND ENGINE (Web Audio API) ---
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function playSound(type) {
        try {
            if (!audioCtx) audioCtx = new AudioCtx();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;

            if (type === 'chip') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'tick') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'shake') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(80, now + 0.3);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'win') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.1);
                osc.frequency.setValueAtTime(783.99, now + 0.2);
                osc.frequency.setValueAtTime(1046.50, now + 0.3);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
            }
        } catch (e) {
            console.log("Audio play suppressed");
        }
    }

    // --- INITIALIZE GAME ---
    function init() {
        generateInitialHistory();
        updateUserProfileDisplay();
        startNewRound();
        setupEventListeners();
        startSimulatedChat();
    }

    // --- USER PROFILE & AUTH MANAGEMENT ---
    function updateUserProfileDisplay() {
        usernameDisplay.innerText = currentUsername;

        if (currentUser.role === "ADMIN") {
            userBadge.innerText = "ADMIN";
            userBadge.className = "badge-admin";
            crownIcon.style.display = "block";
            btnOpenAdmin.style.display = "flex";
            if (btnQuickAdminTool) btnQuickAdminTool.style.display = "flex";
            if (quickAuthLabel) quickAuthLabel.innerText = "ADMIN (VÔ HẠN)";
        } else {
            userBadge.innerText = "VIP";
            userBadge.className = "badge-admin";
            userBadge.style.background = "linear-gradient(45deg, #00FF88, #0088FF)";
            crownIcon.style.display = "none";
            btnOpenAdmin.style.display = "none";
            if (btnQuickAdminTool) btnQuickAdminTool.style.display = "none";
            if (quickAuthLabel) quickAuthLabel.innerText = currentUsername;
        }

        updateBalanceDisplay();

        // Sync Deposit Bank Transfer Content
        bankContentText.innerText = `NAP ${currentUsername.toUpperCase()}`;

        // Sync Auth Modal detail
        detailUsername.innerText = currentUsername;
        adminUserName.innerText = `${currentUsername} (${currentUser.role})`;
    }

    function updateBalanceDisplay() {
        if (currentUser.isUnlimited) {
            userBalanceText.innerText = "VÔ HẠN (∞ VNĐ)";
            userBalanceText.style.color = "#00FF88";
            detailBalance.innerText = "∞ VNĐ";
            toggleUnlimitedMoney.checked = true;
            unlimitedStatusText.innerText = "ĐANG BẬT (∞ VNĐ)";
            unlimitedStatusText.style.color = "#00FF88";
        } else {
            const formatted = `${formatMoney(currentUser.balance)} VNĐ`;
            userBalanceText.innerText = formatted;
            userBalanceText.style.color = "#FFD700";
            detailBalance.innerText = formatted;
            toggleUnlimitedMoney.checked = false;
            unlimitedStatusText.innerText = "ĐÃ TẮT";
            unlimitedStatusText.style.color = "#FF3333";
        }
    }

    function switchUser(username) {
        if (usersDb[username]) {
            currentUsername = username;
            currentUser = usersDb[username];
            updateUserProfileDisplay();
            addChatMessage("Hệ thống", `Đã chuyển sang tài khoản ${username}!`);
            showAuthLoggedInBox();
        }
    }

    function showAuthLoggedInBox() {
        loginForm.classList.add("hidden");
        registerForm.classList.add("hidden");
        document.querySelector(".auth-tabs").classList.add("hidden");
        loggedInBox.classList.remove("hidden");
    }

    function showAuthLoginForm() {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        document.querySelector(".auth-tabs").classList.remove("hidden");
        tabLoginBtn.classList.add("active");
        tabRegisterBtn.classList.remove("active");
        loggedInBox.classList.add("hidden");
    }

    // --- HISTORY GENERATOR ---
    function generateInitialHistory() {
        gameHistory = [];
        for (let i = 0; i < 15; i++) {
            const sum = Math.floor(Math.random() * 16) + 3;
            gameHistory.push({
                sum: sum,
                type: sum > 10 ? 'tai' : 'xiu'
            });
        }
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = "";
        let taiCount = 0;
        let xiuCount = 0;

        gameHistory.forEach(item => {
            const el = document.createElement("div");
            el.className = `history-item ${item.type}`;
            el.innerText = item.sum;
            historyList.appendChild(el);

            if (item.type === 'tai') taiCount++;
            else xiuCount++;
        });

        statTaiCount.innerText = taiCount;
        statXiuCount.innerText = xiuCount;
        historyList.scrollLeft = historyList.scrollWidth;
    }

    // --- GAME LOOP & TIMERS ---
    function startNewRound() {
        clearInterval(timerInterval);
        gameState = "BETTING";
        timerValue = 30;
        roundNumber++;
        roundNumberText.innerText = `#${roundNumber}`;
        gameStatusText.innerText = "ĐANG CHỜ ĐẶT CƯỢC";
        gameStatusText.style.color = "#00FF88";

        userBetXiu = 0;
        userBetTai = 0;
        updateUserBetDisplay();

        totalPoolXiu = Math.floor(Math.random() * 50000000) + 20000000;
        totalPoolTai = Math.floor(Math.random() * 50000000) + 20000000;
        playersXiu = Math.floor(Math.random() * 80) + 30;
        playersTai = Math.floor(Math.random() * 80) + 30;
        updatePoolDisplay();

        bowl.classList.remove("opened", "shaking");
        btnReveal.classList.add("hidden");
        resultOverlay.classList.add("hidden");
        boxXiu.classList.remove("winner", "selected");
        boxTai.classList.remove("winner", "selected");

        updateTimerUI();

        timerInterval = setInterval(() => {
            timerValue--;
            updateTimerUI();

            if (timerValue > 5) {
                simulateLiveBets();
            } else if (timerValue === 5) {
                gameState = "LOCKED";
                gameStatusText.innerText = "CÂN CỬA / KHÓA CƯỢC";
                gameStatusText.style.color = "#FFD700";
                playSound('tick');
            } else if (timerValue > 0 && timerValue <= 5) {
                playSound('tick');
            } else if (timerValue === 0) {
                clearInterval(timerInterval);
                processRollPhase();
            }
        }, 1000);
    }

    function updateTimerUI() {
        timerText.innerText = timerValue;
        const totalDash = 283;
        const offset = totalDash - (timerValue / 30) * totalDash;
        timerPath.style.strokeDashoffset = offset;

        if (timerValue <= 5) {
            timerPath.style.stroke = "#FF3333";
        } else {
            timerPath.style.stroke = "#FFD700";
        }
    }

    function simulateLiveBets() {
        const deltaXiu = Math.floor(Math.random() * 5) * 50000;
        const deltaTai = Math.floor(Math.random() * 5) * 50000;
        totalPoolXiu += deltaXiu;
        totalPoolTai += deltaTai;
        if (deltaXiu > 0) playersXiu += Math.floor(Math.random() * 2);
        if (deltaTai > 0) playersTai += Math.floor(Math.random() * 2);
        updatePoolDisplay();
    }

    function updatePoolDisplay() {
        xiuTotalMoneyText.innerText = formatMoney(totalPoolXiu);
        taiTotalMoneyText.innerText = formatMoney(totalPoolTai);
        xiuTotalPlayersText.innerText = playersXiu;
        taiTotalPlayersText.innerText = playersTai;
    }

    // --- ROLL PHASE ---
    function processRollPhase() {
        gameState = "SHAKING";
        gameStatusText.innerText = "ĐANG XÓC ĐĨA...";
        gameStatusText.style.color = "#FF8C00";

        bowl.classList.add("shaking");
        playSound('shake');

        setTimeout(() => {
            bowl.classList.remove("shaking");
            generateDiceResults();
            renderDiceDots();

            gameState = "REVEAL";
            gameStatusText.innerText = "SẴN SÀNG MỞ BÁT!";
            gameStatusText.style.color = "#FFD700";

            btnReveal.classList.remove("hidden");

            setTimeout(() => {
                if (gameState === "REVEAL") {
                    revealResult();
                }
            }, 4000);

        }, 2000);
    }

    function generateDiceResults() {
        let d1, d2, d3, sum;

        if (forcedResult === 'tai') {
            do {
                d1 = Math.floor(Math.random() * 6) + 1;
                d2 = Math.floor(Math.random() * 6) + 1;
                d3 = Math.floor(Math.random() * 6) + 1;
                sum = d1 + d2 + d3;
            } while (sum <= 10);
        } else if (forcedResult === 'xiu') {
            do {
                d1 = Math.floor(Math.random() * 6) + 1;
                d2 = Math.floor(Math.random() * 6) + 1;
                d3 = Math.floor(Math.random() * 6) + 1;
                sum = d1 + d2 + d3;
            } while (sum > 10);
        } else {
            d1 = Math.floor(Math.random() * 6) + 1;
            d2 = Math.floor(Math.random() * 6) + 1;
            d3 = Math.floor(Math.random() * 6) + 1;
            sum = d1 + d2 + d3;
        }

        diceResult = [d1, d2, d3];
        diceSum = sum;
        isTaiResult = sum > 10;
    }

    function renderDiceDots() {
        for (let i = 1; i <= 3; i++) {
            const diceEl = document.getElementById(`dice-${i}`);
            const val = diceResult[i - 1];
            diceEl.setAttribute("data-value", val);
            diceEl.innerHTML = getDiceDotsHTML(val);
        }
    }

    function getDiceDotsHTML(val) {
        const layouts = {
            1: [5],
            2: [1, 9],
            3: [1, 5, 9],
            4: [1, 3, 7, 9],
            5: [1, 3, 5, 7, 9],
            6: [1, 3, 4, 6, 7, 9]
        };
        const dots = layouts[val] || [5];
        let html = "";
        for (let grid = 1; grid <= 9; grid++) {
            if (dots.includes(grid)) {
                html += `<div class="dot dot-${grid}"></div>`;
            } else {
                html += `<div></div>`;
            }
        }
        return html;
    }

    // --- REVEAL BOWL & PAYOUT ---
    function revealResult() {
        if (gameState !== "REVEAL") return;
        gameState = "RESULT";

        bowl.classList.add("opened");
        btnReveal.classList.add("hidden");

        sumBadge.innerText = diceSum;
        resultTitle.innerText = isTaiResult ? "TÀI" : "XỈU";
        resultOverlay.classList.remove("hidden");

        if (isTaiResult) {
            boxTai.classList.add("winner");
            gameStatusText.innerText = `KẾT QUẢ: ${diceSum} - TÀI`;
            gameStatusText.style.color = "#FF3333";
        } else {
            boxXiu.classList.add("winner");
            gameStatusText.innerText = `KẾT QUẢ: ${diceSum} - XỈU`;
            gameStatusText.style.color = "#00D2FF";
        }

        gameHistory.push({
            sum: diceSum,
            type: isTaiResult ? 'tai' : 'xiu'
        });
        if (gameHistory.length > 20) gameHistory.shift();
        renderHistory();

        let winAmount = 0;
        if (isTaiResult && userBetTai > 0) {
            winAmount = userBetTai * 2;
        } else if (!isTaiResult && userBetXiu > 0) {
            winAmount = userBetXiu * 2;
        }

        if (winAmount > 0) {
            playSound('win');
            if (!currentUser.isUnlimited) {
                currentUser.balance += winAmount;
                updateBalanceDisplay();
            }
            showWinToast(winAmount);
            addChatMessage("Hệ thống", `🎉 ${currentUsername} thắng cược lớn +${formatMoney(winAmount)} VNĐ!`);
        }

        setTimeout(() => {
            startNewRound();
        }, 6000);
    }

    function showWinToast(amount) {
        winToastAmount.innerText = `+${formatMoney(amount)} VNĐ`;
        winToast.classList.remove("hidden");
        setTimeout(() => {
            winToast.classList.add("hidden");
        }, 3500);
    }

    // --- USER BETTING INTERACTIONS ---
    function placeBet(type) {
        if (gameState !== "BETTING" || timerValue <= 5) {
            alert("Đã hết thời gian đặt cược!");
            return;
        }

        const betAmount = selectedChipValue;

        if (!currentUser.isUnlimited && currentUser.balance < betAmount) {
            alert("Số dư không đủ! Vui lòng ấn 'NẠP TIỀN' để nạp thêm!");
            depositModal.classList.remove("hidden");
            return;
        }

        playSound('chip');

        if (!currentUser.isUnlimited) {
            currentUser.balance -= betAmount;
            updateBalanceDisplay();
        }

        if (type === 'xiu') {
            userBetXiu += betAmount;
            totalPoolXiu += betAmount;
            boxXiu.classList.add("selected");
        } else {
            userBetTai += betAmount;
            totalPoolTai += betAmount;
            boxTai.classList.add("selected");
        }

        updateUserBetDisplay();
        updatePoolDisplay();
    }

    function clearBet() {
        if (gameState !== "BETTING" || timerValue <= 5) return;
        if (userBetXiu === 0 && userBetTai === 0) return;

        playSound('chip');
        if (!currentUser.isUnlimited) {
            currentUser.balance += (userBetXiu + userBetTai);
            updateBalanceDisplay();
        }

        totalPoolXiu -= userBetXiu;
        totalPoolTai -= userBetTai;

        userBetXiu = 0;
        userBetTai = 0;

        boxXiu.classList.remove("selected");
        boxTai.classList.remove("selected");

        updateUserBetDisplay();
        updatePoolDisplay();
    }

    function doubleBet() {
        if (gameState !== "BETTING" || timerValue <= 5) return;
        if (userBetXiu > 0) placeBet('xiu');
        if (userBetTai > 0) placeBet('tai');
    }

    function allinBet() {
        if (gameState !== "BETTING" || timerValue <= 5) return;
        selectedChipValue = 500000;
        chips.forEach(c => c.classList.remove("selected"));
        document.querySelector(".chip-500k").classList.add("selected");
        placeBet(userBetTai > userBetXiu ? 'tai' : 'xiu');
    }

    function updateUserBetDisplay() {
        myXiuBetText.innerText = formatMoney(userBetXiu);
        myTaiBetText.innerText = formatMoney(userBetTai);
    }

    function formatMoney(amount) {
        return amount.toLocaleString('vi-VN');
    }

    // --- DEPOSIT PROCESSOR ---
    function processDeposit(amount, methodText) {
        if (!currentUser.isUnlimited) {
            currentUser.balance += amount;
            updateBalanceDisplay();
        }

        depositHistory.unshift({
            amount: amount,
            method: methodText,
            status: "Thành công"
        });
        renderDepositHistory();

        playSound('win');
        alert(`🎉 Nạp thành công +${formatMoney(amount)} VNĐ qua ${methodText}!`);
        addChatMessage("Hệ thống", `💳 Nạp tiền thành công +${formatMoney(amount)} VNĐ!`);
    }

    function renderDepositHistory() {
        depHistList.innerHTML = "";
        depositHistory.slice(0, 5).forEach(item => {
            const row = document.createElement("div");
            row.className = "dep-hist-item";
            row.innerHTML = `
                <span>${formatMoney(item.amount)} VNĐ (${item.method})</span>
                <span class="status-success">${item.status}</span>
            `;
            depHistList.appendChild(row);
        });
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Chips
        chips.forEach(chip => {
            chip.addEventListener("click", () => {
                chips.forEach(c => c.classList.remove("selected"));
                chip.classList.add("selected");
                selectedChipValue = parseInt(chip.getAttribute("data-value"));
                playSound('chip');
            });
        });

        boxXiu.addEventListener("click", () => placeBet('xiu'));
        boxTai.addEventListener("click", () => placeBet('tai'));

        btnClearBet.addEventListener("click", clearBet);
        btnDoubleBet.addEventListener("click", doubleBet);
        btnAllinBet.addEventListener("click", allinBet);

        btnReveal.addEventListener("click", revealResult);
        bowl.addEventListener("click", () => {
            if (gameState === "REVEAL") revealResult();
        });

        // QUICK ACTION BAR LISTENERS
        if (btnQuickDeposit) {
            btnQuickDeposit.addEventListener("click", () => {
                depositModal.classList.remove("hidden");
            });
        }
        if (btnQuickAuth) {
            btnQuickAuth.addEventListener("click", () => {
                authModal.classList.remove("hidden");
            });
        }
        if (btnQuickAdminTool) {
            btnQuickAdminTool.addEventListener("click", () => {
                adminModal.classList.remove("hidden");
            });
        }

        // AUTH MODAL LISTENERS
        btnOpenAuth.addEventListener("click", () => {
            authModal.classList.remove("hidden");
        });
        document.getElementById("user-info-box").addEventListener("click", () => {
            authModal.classList.remove("hidden");
        });
        btnCloseAuth.addEventListener("click", () => {
            authModal.classList.add("hidden");
        });

        tabLoginBtn.addEventListener("click", showAuthLoginForm);
        tabRegisterBtn.addEventListener("click", () => {
            loginForm.classList.add("hidden");
            registerForm.classList.remove("hidden");
            tabRegisterBtn.classList.add("active");
            tabLoginBtn.classList.remove("active");
        });

        // LOGIN SUBMIT
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const uname = document.getElementById("login-username").value.trim();
            const pass = document.getElementById("login-password").value;

            if (usersDb[uname] && usersDb[uname].password === pass) {
                switchUser(uname);
                authModal.classList.add("hidden");
                alert(`Đăng nhập thành công! Chào mừng ${uname}`);
            } else {
                alert("Tên đăng nhập hoặc mật khẩu không đúng!");
            }
        });

        // REGISTER SUBMIT
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const uname = document.getElementById("reg-username").value.trim();
            const pass = document.getElementById("reg-password").value;
            const confirmPass = document.getElementById("reg-confirm-password").value;

            if (!uname) return alert("Vui lòng nhập tên đăng nhập!");
            if (pass !== confirmPass) return alert("Mật khẩu xác nhận không khớp!");
            if (usersDb[uname]) return alert("Tên đăng nhập đã tồn tại!");

            // Create user
            usersDb[uname] = {
                password: pass,
                balance: 100000, // +100k bonus
                isUnlimited: false,
                role: "VIP"
            };

            switchUser(uname);
            authModal.classList.add("hidden");
            alert(`🎉 Đăng ký thành công! Bạn nhận được +100,000 VNĐ trải nghiệm!`);
        });

        // QUICK ADMIN LOGIN
        btnQuickAdminLogin.addEventListener("click", () => {
            switchUser("admin");
            authModal.classList.add("hidden");
            alert("👑 Đã đăng nhập nhanh quyền ADMIN VIP (admin / hvk@123)!");
        });

        btnLogout.addEventListener("click", () => {
            showAuthLoginForm();
            switchUser("admin");
            alert("Đã đăng xuất! Tự động quay lại tài khoản mặc định.");
        });

        // DEPOSIT MODAL LISTENERS
        btnOpenDeposit.addEventListener("click", () => {
            depositModal.classList.remove("hidden");
        });
        btnCloseDeposit.addEventListener("click", () => {
            depositModal.classList.add("hidden");
        });

        depTabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                depTabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const targetTab = btn.getAttribute("data-tab");

                document.getElementById("dep-bank-content").classList.toggle("hidden", targetTab !== "bank");
                document.getElementById("dep-card-content").classList.toggle("hidden", targetTab !== "card");
                document.getElementById("dep-instant-content").classList.toggle("hidden", targetTab !== "instant");
            });
        });

        // CARD DEPOSIT FORM
        cardDepositForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const val = parseInt(document.getElementById("card-amount").value);
            const carrier = document.getElementById("card-carrier").selectedOptions[0].text;
            processDeposit(val, `Thẻ cào ${carrier}`);
            document.getElementById("card-pin").value = "";
            document.getElementById("card-seri").value = "";
        });

        // INSTANT PACK BUTTONS
        packBtns.forEach(p => {
            p.addEventListener("click", () => {
                const addVal = parseInt(p.getAttribute("data-add"));
                processDeposit(addVal, "Nạp Nhanh Demo");
            });
        });

        // ADMIN MODAL LISTENERS
        btnOpenAdmin.addEventListener("click", () => {
            adminModal.classList.remove("hidden");
        });
        btnCloseAdmin.addEventListener("click", () => {
            adminModal.classList.add("hidden");
        });

        toggleUnlimitedMoney.addEventListener("change", (e) => {
            currentUser.isUnlimited = e.target.checked;
            unlimitedStatusText.innerText = currentUser.isUnlimited ? "ĐANG BẬT (∞ VNĐ)" : "ĐÃ TẮT";
            unlimitedStatusText.style.color = currentUser.isUnlimited ? "#00FF88" : "#FF3333";
            updateBalanceDisplay();
        });

        btnCheatAuto.addEventListener("click", () => setCheat('auto', btnCheatAuto, "Ngẫu nhiên"));
        btnCheatTai.addEventListener("click", () => setCheat('tai', btnCheatTai, "Ép TÀI (11-18)"));
        btnCheatXiu.addEventListener("click", () => setCheat('xiu', btnCheatXiu, "Ép XỈU (1-10)"));

        btnAddMoney.addEventListener("click", () => {
            const addVal = parseInt(inputCustomMoney.value) || 0;
            if (!currentUser.isUnlimited) {
                currentUser.balance += addVal;
                updateBalanceDisplay();
            }
            alert(`Đã cộng +${formatMoney(addVal)} VNĐ vào tài khoản!`);
        });

        btnResetGame.addEventListener("click", () => {
            generateInitialHistory();
            startNewRound();
            adminModal.classList.add("hidden");
            alert("Đã reset thống kê game!");
        });

        btnSendChat.addEventListener("click", sendUserChat);
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendUserChat();
        });
    }

    function setCheat(choice, btn, label) {
        forcedResult = choice;
        document.querySelectorAll(".btn-admin-choice").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        cheatHintText.innerText = `Kết quả ván tới: ${label}`;
    }

    // --- CHAT ---
    function sendUserChat() {
        const text = chatInput.value.trim();
        if (!text) return;
        addChatMessage(currentUsername, text);
        chatInput.value = "";
    }

    function addChatMessage(author, message) {
        const msgEl = document.createElement("div");
        msgEl.className = author.includes("admin") || author.includes("Admin") || author === "Hệ thống" ? "chat-msg system" : "chat-msg";
        msgEl.innerHTML = `<b>${author}:</b> ${escapeHtml(message)}`;
        chatMessages.appendChild(msgEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function startSimulatedChat() {
        const sampleBotChats = [
            "Tài chắc ván này rồi anh em",
            "Xỉu 500k theo kèo cao thủ",
            "Bát này nghi về Tài lắm",
            "Cầu bệt Xỉu 4 tay rồi",
            "Admin uy tín vĩnh cửu",
            "Tất tay Xỉu gỡ gạc thôi"
        ];
        const botNames = ["ĐạiGia_SoDec", "TàiXỉuMaster", "PhongBa_Casino", "SóiBiển", "CờBạcNhàNghề"];

        setInterval(() => {
            if (Math.random() > 0.5) {
                const randomBot = botNames[Math.floor(Math.random() * botNames.length)];
                const randomMsg = sampleBotChats[Math.floor(Math.random() * sampleBotChats.length)];
                addChatMessage(randomBot, randomMsg);
            }
        }, 7000);
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Launch
    init();
});
