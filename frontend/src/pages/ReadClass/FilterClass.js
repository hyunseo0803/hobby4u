import "../../styles/ReadClass.css";
import ReadClassOptionLB from "../../component/AllReadOptionLB";
import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export default function FILTER_CLASS(props) {
	const {
		option,
		money,
		theme,
		word,
		readWordFilter,
		handleReadDetail,
		fliteredata,
		like_status,
		goodClick,
		readFilter,
		token,
	} = props;

	function isImage(urlString) {
		const fileEx = urlString.split(".").pop().toLowerCase();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(fileEx);
	}

	useEffect(() => {
		if (option !== "" || money !== "") {
			if (theme !== "") {
				readFilter(theme);
			} else if (word !== "") {
				readWordFilter(word);
			} else readFilter();
		}
	}, [option, money, theme, word]);

	return (
		<>
			<div className="row_center_wrap">
				<div className="row_center_wrap">
					{fliteredata &&
						fliteredata.map((filter, index) => {
							const firstimg = filter.img.replace("/frontend/public/", "/");

							const handleImageClick = (e) => {
								e.stopPropagation();
								handleReadDetail(filter.class_id);
							};
							const handleButtonClick = () => {
								handleReadDetail(filter.class_id);
							};
							const isFree = filter.money === "0";
							const isOnline = filter.type === "online";

							const likeStatusItem = like_status
								? like_status.find((item) => item.class_id === filter.class_id)
								: null;

							return (
								<div key={index} className="class_div_btn">
									<div className="firstimg_container">
										{isImage(filter.img) ? (
											<img
												className="firstimg"
												src={firstimg}
												alt="gg"
												onClick={handleImageClick}
											/>
										) : (
											<video
												className="firstimg"
												src={firstimg}
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
											{token ? (
												<button
													className="like_btn"
													onClick={() => goodClick(filter.class_id)}
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

											<div className="like_text">{filter.goodCount}</div>
										</div>
									</div>
									<button
										value={filter.class_id}
										onClick={handleButtonClick}
										className="class_title_btn"
									>
										{filter.title}
									</button>
								</div>
							);
						})}
				</div>
			</div>
		</>
	);
}
