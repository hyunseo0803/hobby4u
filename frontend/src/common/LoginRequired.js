import React from "react";
import { IoLogIn } from "react-icons/io5";
import "../styles/LoginRequired.css";

const LoginRequired = () => {
	return (
		<div
			style={{
				width: "100%",
				padding: 50,
				justifyContent: "center",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<div
				style={{
					width: 250,
					padding: 45,
					height: 200,
				}}
			>
				<IoLogIn size={120} color="#26305F" />
			</div>
			<div
				style={{
					textAlign: "center",
					fontSize: 30,
					letterSpacing: 2,
					fontFamily: "Pretendard-Regular",
					padding: 10,
					height: 100,
				}}
			>
				로그인이 필요한 서비스 입니다.
			</div>
			<div
				style={{
					textAlign: "center",
					fontSize: 15,
					letterSpacing: 2,
					fontFamily: "Pretendard-Regular",
					padding: 10,
					height: 150,
				}}
			>
				서비스 이용 중이라면 세션이 만료되었으니 새로고침 후 다시 로그인
				해주세요.{" "}
			</div>
		</div>
	);
};

export default LoginRequired;
