import "../../styles/ReadClass.css";
import React, { useEffect, useState, useCallback } from "react";

import ReadClassOptionLB from "../../component/AllReadOptionLB";
import left from "../../assets/Left.png";
import right from "../../assets/Right.png";

export default function NEW_CLASS(props) {
	const { newdata, handleReadDetail, like_status, goodClick, readNew } = props;

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

	useEffect(() => {
		const timer = setInterval(nextSlide, 5000);
		return () => {
			clearInterval(timer);
		};
	}, [nextSlide]);

	useEffect(() => {
		readNew();
	}, []);

	function isImage(urlString) {
		const fileEx = urlString.split(".").pop().toLowerCase();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(fileEx);
	}

	return (
		<div className="row_center_wrap">
			<div className="test">
				<button className="border_transcolor" onClick={prevSlide}>
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
				const likeStatusItem = like_status
					? like_status.find((item) => item.class_id === newItem.class_id)
					: null;

				const updatedImg = newItem.id.updateprofile
					? newItem.id.updateprofile.replace("/frontend/public/", "/")
					: null;

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
									className="like_btn"
									onClick={() => goodClick(newItem.class_id)}
								>
									{likeStatusItem ? "❤️" : "🤍"} 좋아요
								</button>
								<div className="like_text">{newItem.goodCount}</div>
							</div>
						</div>
						<button
							className="class_title_btn"
							key={index}
							value={newItem.class_id}
							onClick={handleButtonClick}
						>
							{newItem.title}
						</button>
						{/* <div className="row_center_wrap">
							<div className="class_user_img">
								{updatedImg ? (
									<img
										src={updatedImg}
										alt="profile"
										width={30}
										height={30}
										style={{ borderRadius: "50%" }}
									/>
								) : (
									<img
										src={newItem.id.profile}
										alt="profile"
										width={30}
										height={30}
										style={{ borderRadius: "50%" }}
									/>
								)}
							</div>
							<div className="class_nickname_btn">{newItem.id.nickname}</div>
						</div> */}
					</div>
				);
			})}
			<div className="test">
				<button className="border_transcolor" onClick={nextSlide}>
					<img src={right} alt="right" />
				</button>
			</div>
		</div>
	);
}
