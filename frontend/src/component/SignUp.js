import React, { useState } from "react";

const SignUp = ({ onClose }) => {
	const [email, setEmail] = useState(""); // 이메일 상태
	const [password, setPassword] = useState(""); // 비밀번호 상태
	const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
	const [nickname, setNickname] = useState(""); // 활동명 상태
	const [verificationCode, setVerificationCode] = useState(""); // 인증 코드 상태

	// 이메일 인증 코드 전송 함수
	const handleSendVerificationCode = () => {
		// 이메일 인증 코드 전송 로직
		console.log("이메일 인증 코드 전송");
	};

	// 회원가입 버튼 클릭 핸들러
	const handleSignUp = () => {
		// 회원가입 로직
		console.log("회원가입");
	};

	// 모달 창 닫기 버튼 클릭 핸들러
	const handleCloseModal = () => {
		onClose(); // 부모 컴포넌트에서 전달받은 onClose 함수 호출하여 모달 창 닫기
	};

	// 로그인 모달로 돌아가기 버튼 클릭 핸들러
	const handleGoToLoginModal = () => {
		onClose(); // 부모 컴포넌트에서 전달받은 onClose 함수 호출하여 모달 창 닫기
		// 로그인 모달로 돌아가는 로직
		console.log("로그인 모달로 돌아가기");
	};
	const handleOverlayClick = (e) => {
		if (e.target.classList.contains("modal-overlay")) {
			handleCloseModal();
		}
	};

	return (
		<div className="modal-overlay" onClick={handleOverlayClick}>
			<div className="modal-content">
				{/* 회원가입 모달 내용 */}
				<h1>회원가입 모달창</h1>

				{/* 이메일 입력 폼 */}
				<input
					type="email"
					placeholder="이메일"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				{/* 비밀번호 입력 폼 */}
				<input
					type="password"
					placeholder="비밀번호"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				{/* 비밀번호 확인 입력 폼 */}
				<input
					type="password"
					placeholder="비밀번호 확인"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>

				{/* 활동명 입력 폼 */}
				<input
					type="text"
					placeholder="활동명"
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
				/>

				{/* 인증 코드 입력 폼 */}
				<input
					type="text"
					placeholder="인증 코드"
					value={verificationCode}
					onChange={(e) => setVerificationCode(e.target.value)}
				/>

				{/* 인증 코드 전송 버튼 */}
				<button onClick={handleSendVerificationCode}>인증 코드 전송</button>

				{/* 회원가입 버튼 */}
				<button onClick={handleSignUp}>회원가입</button>

				<button onClick={handleGoToLoginModal}>로그인 모달로 돌아가기</button>
			</div>
		</div>
	);
};

export default SignUp;
