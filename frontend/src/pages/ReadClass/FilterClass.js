import "../../styles/ReadClass.css";
import ReadClassOptionLB from "../../component/AllReadOptionLB";
import { useEffect, useState } from "react";

export default function FILTER_CLASS(props) {
	const {
		option,
		money,
		apply_ok,
		theme,
		word,
		readWordFilter,
		handleReadDetail,
		fliteredata,
		like_status,
		goodClick,
		readFilter,
	} = props;

	function isImage(urlString) {
		const fileEx = urlString.split(".").pop().toLowerCase();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(fileEx);
	}

	useEffect(() => {
		if (option !== "" || money !== "" || apply_ok === false) {
			if (theme !== "") {
				readFilter(theme);
			} else if (word !== "") {
				readWordFilter(word);
			} else readFilter();
		}
	}, [option, money, apply_ok, theme, word]);

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

							const updatedImg = filter.id.updateprofile
								? filter.id.updateprofile.replace("/frontend/public/", "/")
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
											<button
												className="like_btn"
												onClick={() => goodClick(filter.class_id)}
											>
												{likeStatusItem ? "❤️" : "🤍"} 좋아요
											</button>
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
													src={filter.id.profile}
													alt="profile"
													width={30}
													height={30}
													style={{ borderRadius: "50%" }}
												/>
											)}
										</div>
										<div className="class_nickname_btn">
											{filter.id.nickname}
										</div>
									</div> */}
								</div>
							);
						})}
				</div>
				{/* )} */}
			</div>
		</>
	);
}
