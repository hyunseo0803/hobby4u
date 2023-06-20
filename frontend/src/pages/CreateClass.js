import React, { useEffect, useState } from "react";
import "../styles/CreateClass.css";
import { useNavigate } from "react-router-dom";
import Img from "../assets/Img.gif";

function CreateClass() {
	const navigate = useNavigate();

	const [token, SetToken] = useState();
	const [selectedOption, setSelectedOption] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			SetToken(true);
			getUserData();
		} else {
			SetToken(false);
		}
	}, []);

	const getUserData = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Token is not available");
			}

			const response = await fetch(
				"http://localhost:8000/api/user/get_user_data/",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization header에 포함시킴
					},
				}
			);
			if (response.ok) {
				const user = await response.json();
				// const nickname = user.nickname;
				// const userImg = user.profileImg;
				// const userEmail = user.email;
				console.log(user);
			} else {
				// 예외처리
				throw new Error("Failed to fetch user data");
			}
		} catch (error) {
			// 예외처리
			throw new Error("Token is not available");
		}
	};

	function handleOptionChange(event) {
		setSelectedOption(event.target.value);
	}

	function handlePageChange() {
		if (selectedOption === "대면") {
			navigate("/page1");
		} else if (selectedOption === "비대면") {
			navigate("/page2");
		}
	}

	return (
		<div className="wrap">
			{token ? (
				<>
					<div className="component_wrapper">
						<div className="left_wrapper">
							<div> 썸네일 이미지 및 영상 업로드</div>
							<div className="img_wrapper">
								<div className="img_container">
									<img className="img" width={70} src={Img} alt="" />
								</div>
							</div>
						</div>
						<div>
							<div>파일 업로드</div>
							<div>제목을 입력해 주세요</div>
							<div>나만의 클래스를 간단히 소개해주세요</div>
							<div>
								<label>
									<input
										type="radio"
										value="대면"
										checked={selectedOption === "대면"}
										onChange={handleOptionChange}
									/>
									오프라인 클래스
								</label>
								<label>
									<input
										type="radio"
										value="비대면"
										checked={selectedOption === "비대면"}
										onChange={handleOptionChange}
									/>
									온라인 클래스
								</label>
							</div>
							<div>
								<button onClick={handlePageChange}>NEXT</button>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div>로그인 필요함</div>
				</>
			)}
		</div>
	);
}
export default CreateClass;
