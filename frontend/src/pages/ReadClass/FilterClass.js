import "../../styles/ReadClass.css";
import ReadClassOptionLB from "../../component/AllReadOptionLB";
import { useEffect } from "react";

export default function FILTER_CLASS(props) {
	const {
		option,
		money,
		apply_ok,
		data,
		readAll,
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
		if (option === "" && money === "" && apply_ok === false) {
			readAll();
		} else {
			readFilter();
		}
	}, [option, money, apply_ok]);

	return (
		<div className="row_center_wrap">
			{option === "" && money === "" && apply_ok === false ? (
				data.map((classItem, index) => {
					const firstimg = classItem.img.replace("/frontend/public/", "/");

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

					return (
						<div key={index} className="class_div_btn">
							<div className="firstimg_container">
								{isImage(classItem.img) ? (
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
										onClick={() => goodClick(classItem.class_id)}
									>
										{likeStatusItem ? "❤️" : "🤍"} 좋아요
									</button>
									<div className="like_text">{classItem.goodCount}</div>
								</div>
							</div>
							<button
								value={classItem.class_id}
								onClick={handleButtonClick}
								className="class_title_btn"
							>
								{classItem.title}
							</button>
							<div className="row_center_wrap">
								<img
									src={classItem.id.profile}
									alt="profile"
									width={30}
									height={30}
									style={{ borderRadius: "50%" }}
								/>
								<div className="class_nickname_btn">
									{classItem.id.nickname}
								</div>
							</div>
						</div>
					);
				})
			) : (
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
									<div className="row_center_wrap">
										<img
											src={filter.id.profile}
											alt="profile"
											width={30}
											height={30}
											style={{ borderRadius: "50%" }}
										/>
										<div className="class_nickname_btn">
											{filter.id.nickname}
										</div>
									</div>
								</div>
							);
						})}
				</div>
			)}
		</div>
	);
}
