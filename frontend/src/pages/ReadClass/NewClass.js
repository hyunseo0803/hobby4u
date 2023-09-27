import "../../styles/ReadClass.css";
import React, { useEffect, useState, useCallback } from "react";

import axios from "axios";

import ReadClassOptionLB from "../../component/AllReadOptionLB";
import left from "../../assets/Left.png";
import right from "../../assets/Right.png";

export default function NEW_CLASS(props) {
	const { newdata, handleReadDetail, setNewData } = props;
	const [like_status, setLikeStatus] = useState([]);

	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 3;
	const totalPage = Math.ceil(newdata.length / itemsPerPage);

	const paginateData = () => {
		const startIndex = currentPage * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return newdata.slice(startIndex, endIndex);
	};

	const nextSlide = useCallback(() => {
		setCurrentPage((prevPage) => (prevPage + 1) % totalPage);
	}, [totalPage]);

	const prevSlide = useCallback(() => {
		setCurrentPage((prevPage) => (prevPage - 1 + totalPage) % totalPage);
	}, [totalPage]);

	function ReadGoodCount() {
		const token = localStorage.getItem("token");
		const userData = { token: token };
		axios
			.post("http://localhost:8000/api/post/read_goodCount_data/", userData, {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				const likeData = response.data.like_data_list;
				setLikeStatus(likeData);
			})
			.catch((error) => {
				console.error("Error submitting data:", error);
			});
	}

	useEffect(() => {
		ReadGoodCount();
		const timer = setInterval(nextSlide, 5000);
		return () => {
			clearInterval(timer);
		};
	}, [nextSlide]);

	const goodClick = async (classId, liked) => {
		const token = localStorage.getItem("token");
		try {
			const classidData = { classId: classId, token: token };
			const response = await axios.post(
				"http://localhost:8000/api/post/create_goodCount_data/",
				classidData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			ReadGoodCount();

			const updatedDataResponse = await axios
				.get("http://localhost:8000/api/post/read_new_data/", {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((response) => {
					const classNewItem = response.data.new_date_list;
					setNewData(classNewItem);
				})
				.catch((error) => {
					console.error("Error submitting data:", error);
				});
		} catch (error) {
			console.error("좋아요를 처리하는 중 오류 발생:", error);
		}
	};

	function isImage(urlString) {
		const fileEx = urlString.split(".").pop().toLowerCase();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(fileEx);
	}

	return (
		<div className="row_center_wrap">
			<div className="test">
				<button className="slider-control" onClick={prevSlide}>
					<img src={left} alt="left" />
				</button>
			</div>
			{paginateData().map((newItem, index) => {
				const firstimg = newItem.img.replace("/frontend/public/", "/");

				const handleImageClick = (e) => {
					e.stopPropagation();
					handleReadDetail(newItem.class_id);
				};

				const handleButtonClick = () => {
					handleReadDetail(newItem.class_id);
				};
				const isFree = newItem.money === "0";
				const isOnline = newItem.type === "online";
				const likeStatusItem = like_status.find(
					(item) => item.class_id === newItem.class_id
				);

				return (
					<div className="class_div_btn">
						<div className="firstimg_container">
							{isImage(newItem.img) ? (
								<img
									className="firstimg"
									src={firstimg}
									alt="gg"
									width={100}
									onClick={handleImageClick}
								/>
							) : (
								<video
									className="firstimg"
									src={firstimg}
									alt="gg"
									width={100}
									onClick={handleImageClick}
									controls
								/>
							)}
						</div>
						<div
							className="class_div_MO"
							style={{ justifyContent: "space-between", alignItems: "center" }}
						>
							<ReadClassOptionLB isFree={isFree} isOnline={isOnline} />
							<div className="class_GCount">
								<button
									style={{
										border: "none",
										backgroundColor: "transparent",
										justifyContent: "center",
										alignItems: "center",
										height: 30,
										cursor: "pointer",
									}}
									onClick={() => goodClick(newItem.class_id, newItem.liked)}
								>
									{likeStatusItem ? "❤️" : "🤍"} 좋아요
								</button>
								<div
									style={{
										fontSize: 17,
										width: 20,
										padding: 2,
										color: "#F26B6B",
									}}
								>
									{newItem.goodCount}
								</div>
							</div>
						</div>
						<button
							className="slider-control"
							key={index}
							value={newItem.class_id}
							onClick={handleButtonClick}
							style={{
								textAlign: "start",
								justifyContent: "flex-start",
								left: 0,
								marginTop: 5,
							}}
						>
							{newItem.title}
						</button>
						<div className="row_center_wrap">
							<img
								src={newItem.id.profile}
								alt="profile"
								width={30}
								height={30}
								style={{ borderRadius: "50%" }}
							/>
							<div
								style={{
									alignItems: "center",
									justifyContent: "center",
									width: "90%",
									textAlign: "left",
									padding: 4,
								}}
							>
								{newItem.id.nickname}
							</div>
						</div>
					</div>
				);
			})}
			<div className="test">
				<button className="slider-control" onClick={nextSlide}>
					<img src={right} alt="right" />
				</button>
			</div>
		</div>
	);
}
