import "../../styles/ReadClass.css";
import React, { useEffect, useState, useCallback } from "react";

import ReadClassOptionLB from "../../component/AllReadOptionLB";
import left from "../../assets/Left.png";
import right from "../../assets/Right.png";

export default function NEW_CLASS(props) {
	const { newdata, handleReadDetail } = props;

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

				return (
					<button
						key={index}
						className="class_div_btn"
						value={newItem.class_id}
						onClick={handleButtonClick}
					>
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
								<img
									width="25"
									height="25"
									src="https://img.icons8.com/ios/30/f26b6b/like--v1.png"
									alt="like--v1"
								/>
								<div style={{ fontSize: 16, width: 20, color: "#F26B6B" }}>
									{newItem.goodCount}
								</div>
							</div>
						</div>
						<div
							style={{
								textAlign: "start",
								justifyContent: "flex-start",
								left: 0,
								marginTop: 5,
							}}
						>
							{newItem.title}
						</div>
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
					</button>
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
