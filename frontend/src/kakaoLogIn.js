import axios from "axios";

export const kakaoLogIn = async (code) => {
	const Response = await axios.post(`http://localhost:8000/api/kakao`, {
		code,
	});
	return Response.status;
};
