import axios from "axios";
import React, { useEffect, useState } from "react";
import ReadClassOptionLB from "./AllReadOptionLB";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

function ClassCard(props) {
	const {
		classDiv,
		readFirebasefile,
		userData,
		like_status,
		delete_or_cancle,
		mypage,
		status,
		isLoggedIn,
		readMyClass,
		// myclass,
		goodClick,
	} = props;
	const [myclassid, setMyclassid] = useState([]);

	useEffect(() => {
		readMyClassid();
	}, []);

	async function readMyClassid() {
		const jwt_token = localStorage.getItem("token");
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_my_class/`,
				{
					headers: {
						Authorization: `Bearer ${jwt_token}`,
					},
				}
			);
			const myclassid = response.data.allclass_my;
			setMyclassid(myclassid);
		} catch (e) {
			console.error(e);
		}
	}

	const navigate = useNavigate();

	function isImage(urlString) {
		const extension = urlString.split("?")[0].split(".").pop();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(extension);
	}

	async function deletemyclass(value) {
		console.log(value);
		try {
			const response = await axios.post(
				"http://localhost:8000/api/post/delete_my_class/",
				{ class_id: value }
			);
			alert(response.data.message);
			readMyClass();
		} catch (error) {
			console.error(error);
		}
	}

	async function cancleapplyclass(value) {
		try {
			const token = localStorage.getItem("token");

			const response = await axios.post(
				"http://localhost:8000/api/post/cancle_apply_class/",
				{ class_id: value, token: token }
			);
			alert(response.data.message);
			readMyClass();
		} catch (error) {
			console.error(error);
		}
	}

	async function handleReadDetail(value) {
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_some_data/?class_id=${value}`
			);
			const classdetail = response.data.class_data;
			const daydetail = response.data.day_data;
			const updatedClassDetail = { ...classdetail };
			const classImg = await readFirebasefile("classFile", classdetail.img);
			if (classdetail.file) {
				const classfile = await readFirebasefile("file", classdetail["file"]);
				updatedClassDetail.file = classfile;
			}
			if (classdetail["infoimg1"]) {
				const intro1 = await readFirebasefile("intro", classdetail["infoimg1"]);
				updatedClassDetail.infoimg1 = intro1;
			}
			if (classdetail["infoimg2"]) {
				const intro2 = await readFirebasefile("intro", classdetail["infoimg2"]);
				updatedClassDetail.infoimg2 = intro2;
			}
			if (classdetail["infoimg3"]) {
				const intro3 = await readFirebasefile("intro", classdetail["infoimg3"]);
				updatedClassDetail.infoimg3 = intro3;
			}

			updatedClassDetail.img = classImg;

			const updatedDayDetail = await Promise.all(
				daydetail.map(async (day) => {
					const updatedDay = { ...day };
					try {
						updatedDay.day_file = await readFirebasefile("day", day.day_file);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return updatedDay;
				})
			);
			navigate("/readClass/classDetail", {
				state: {
					ClassDetail: updatedClassDetail,
					DayDetail: updatedDayDetail,
					userData: userData,
				},
			});
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}
	return classDiv.map((classItem, index) => {
		const handleImageClick = (e) => {
			e.stopPropagation();
			handleReadDetail(classItem.class_id);
		};

		const handleButtonClick = () => {
			handleReadDetail(classItem.class_id);
		};
		const isFree = classItem.money === "0";
		const isOnline = classItem.type === "online";

		const likeStatusItem = like_status
			? like_status.find((item) => item.class_id === classItem.class_id)
			: null;

		const deleteOk =
			delete_or_cancle && mypage
				? delete_or_cancle.find((item) => item.class_id === classItem.class_id)
				: null;

		const notMyClass =
			myclassid.length > 0
				? !myclassid.some((item) => item.class_id === classItem.class_id)
				: true;

		return (
			<div key={index} className="class_div_btn">
				<div className="firstimg_container">
					{isImage(classItem.img) ? (
						<img
							className="firstimg"
							src={classItem.img}
							alt="gg"
							onClick={handleImageClick}
						/>
					) : (
						<video
							className="firstimg"
							src={classItem.img}
							alt="gg"
							onClick={handleImageClick}
							controls
						/>
					)}
				</div>
				<div
					className="class_div_MO"
					style={{
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<ReadClassOptionLB isFree={isFree} isOnline={isOnline} />
					<div className="class_GCount">
						{isLoggedIn && notMyClass ? (
							<button
								className="like_btn"
								onClick={() => goodClick(classItem.class_id)}
							>
								{likeStatusItem ? (
									<AiFillHeart size={20} color="#EC3535" />
								) : (
									<AiOutlineHeart size={20} color="#EC3535" />
								)}
							</button>
						) : (
							<div className="like">좋아요</div>
						)}

						<div className="like_text">{classItem.goodCount}</div>
					</div>
					{deleteOk && mypage && (
						<button
							onClick={() => {
								console.log("classItem.class_id:", typeof classItem.class_id);
								if (status === "삭제 가능") {
									deletemyclass(classItem.class_id);
								} else {
									cancleapplyclass(classItem.class_id);
								}
							}}
						>
							{status}
						</button>
					)}
				</div>
				<button
					value={classItem.class_id}
					onClick={handleButtonClick}
					className="class_title_btn"
				>
					{classItem.title}
				</button>
			</div>
		);
	});
}

export default ClassCard;
