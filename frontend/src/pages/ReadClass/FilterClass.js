import "../../styles/ReadClass.css";
import ReadClassOptionLB from "../../component/AllReadOptionLB";

export default function FILTER_CLASS(props) {
	const { option, money, apply_ok, data, handleReadDetail, fliteredata } =
		props;

	function isImage(urlString) {
		const fileEx = urlString.split(".").pop().toLowerCase();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(fileEx);
	}

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

					return (
						// <div key={index} className="class_div_btn">
						<button
							key={index}
							className="class_div_btn"
							value={classItem.class_id}
							onClick={handleButtonClick}
						>
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
									<img
										width="25"
										height="25"
										src="https://img.icons8.com/ios/30/f26b6b/like--v1.png"
										alt="like--v1"
									/>
									<div style={{ fontSize: 16, width: 20, color: "#F26B6B" }}>
										{classItem.goodCount}
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
								{classItem.title}
							</div>
							<div className="row_center_wrap">
								<img
									src={classItem.id.profile}
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
									{classItem.id.nickname}
								</div>
							</div>
						</button>
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

							return (
								<button
									key={index}
									className="class_div_btn"
									value={filter.class_id}
									onClick={handleButtonClick}
								>
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
											<img
												width="25"
												height="25"
												src="https://img.icons8.com/ios/30/f26b6b/like--v1.png"
												alt="like--v1"
											/>
											<div
												style={{ fontSize: 16, width: 20, color: "#F26B6B" }}
											>
												{filter.goodCount}
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
										{filter.title}
									</div>
									<div className="row_center_wrap">
										<img
											src={filter.id.profile}
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
											{filter.id.nickname}
										</div>
									</div>
								</button>
							);
						})}
				</div>
			)}
		</div>
	);
}
