import React, { useEffect, useState } from "react";
import "../styles/Myclass.css";
import bad_review from "../assets/bad_review.png";
import good_review from "../assets/good_review.png";

function Myclass(props) {
	const [userNickname, setUserNickname] = useState("");

	const [userImg, setUserImg] = useState("");
	const [updatedImg, setUpdatedImg] = useState("");

	const [userEmail, setUserEmail] = useState("");
	const [userInfo, setUserInfo] = useState("");

	const [good, setGoodReview] = useState(false);
	const [bad, setBadReview] = useState(false);

	useEffect(() => {
		if (good) {
			setBadReview(false);
		} else if (bad) {
			setGoodReview(false);
		}
	}, [good, bad]);

	function GoodreviewEvent() {
		setGoodReview(!good);
		setBadReview(false);
	}

	function BadReviewEvent() {
		setBadReview(!bad);
		setGoodReview(false);
	}

	useEffect(() => {
		getUserData();
	});
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
				const nickname = user.nickname;
				const userImg = user.profileImg;
				const userImgUpdate = user.updateprofile;
				const userEmail = user.email;
				const userInfo = user.info;
				setUserNickname(nickname);
				setUserImg(userImg);
				setUserInfo(userInfo);
				setUserEmail(userEmail);
				if (userImgUpdate) {
					setUpdatedImg(userImgUpdate.replace("/frontend/public/", "/"));
				} else {
					setUserImg(userImg);
				}
			} else {
				// 예외처리
				throw new Error("Failed to fetch user data");
			}
		} catch (error) {
			// 예외처리
			throw new Error("Token is not available");
		}
	};

	return (
		<div className="wrap">
			<div className="user_info_box">
				<div className="user_img">
					{updatedImg ? (
						<img
							style={{ borderRadius: 40 }}
							width="40"
							height="40"
							src={updatedImg}
							alt="user-male-circle--v1"
						/>
					) : (
						<img
							style={{ borderRadius: 40 }}
							width="40"
							height="40"
							src={userImg}
							alt="user-male-circle--v1"
						/>
					)}
				</div>
				<div className="user_info">
					<div className="user_nickname">{userNickname}</div>
					<div className="user_info_text">{userInfo}</div>
					<div className="user_email">{userEmail}</div>
				</div>
			</div>
			<div className="review_wrapper">
				<button
					className={bad ? "review_unclick" : "review"}
					onClick={GoodreviewEvent}
				>
					<img width={40} src={good_review} alt="" /> <text>Good_Review</text>
				</button>
				<button
					className={good ? "review_unclick" : "review"}
					onClick={BadReviewEvent}
				>
					<img width={40} src={bad_review} alt="" />
					<text>Bad_Review</text>
				</button>
			</div>
		</div>
	);
}
export default Myclass;
