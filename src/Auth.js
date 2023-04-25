const express = require("express");
const mysql = require("mysql");
const axios = require("axios");
const cors = require("cors");
const app = express();
require("dotenv").config();

let corsOptions = {
	origin: "http://localhost:3000",
	credentials: true, // 사용자 인증이 필요한 리소스(쿠키, ...등) 접근
};

app.use(cors(corsOptions));

const REST_API_KEY = "0aa1d52197f4048d9b7cbefe466951e8";
const REDIRECT_URI = "http://localhost:3000/auth/kakao/callback";

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const db = mysql.connection({
	host: "localhost", // 호스트
	user: "root", // 데이터베이스 계정
	password: process.env.MYSQL_PASSWORD, // 데이터베이스 비밀번호
	database: "hobby4u", //
});

db.connect((err) => {
	if (err) {
		console.error("mysql 연결 실패");
	}
	console.log("mysql 성공");
});

// 카카오 인증 콜백 핸들러
app.get("/auth/kakao/callback", async (req, res) => {
	const code = req.query.code; // 카카오로부터 전달받은 인가 코드
	try {
		// 액세스 토큰 발급 요청
		const response = await axios.post("https://kauth.kakao.com/oauth/token", {
			grant_type: "authorization_code",
			client_id: REST_API_KEY,
			redirect_uri: REDIRECT_URI,
			code: code,
		});
		const { access_token } = response.data; // 발급받은 액세스 토큰
		// 액세스 토큰을 사용하여 사용자 정보 요청
		const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
		const { id, properties } = userResponse.data; // 사용자 정보
		const { email, nickname, profile_image } = properties;

		db.query(
			`
			INSERT INTO member(
				id,
				nickname,
				email,
				profileImg
			) VALUES (?, ?, ?, ?)`,
			[id, nickname, email, profile_image]
		);

		// TODO: 사용자 정보를 db에 저장하거나 처리하는 로직 구현
		// id는 카카오 사용자 고유 ID, properties에는 사용자 닉네임, 프로필 이미지 등의 정보가 포함되어 있습니다.
		res.status(200).json({
			id,
			email,
			nickname,
			profile_image,
		});
	} catch (error) {
		console.error("카카오 인증 및 사용자 정보 요청 실패", error);
		res.status(500).json({ message: "카카오 인증 및 사용자 정보 요청 실패" });
	}
});
