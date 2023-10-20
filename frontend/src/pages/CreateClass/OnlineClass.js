import "../../styles/CreateClassDetail.css";

import minus from "../../assets/day_class_minus.png";
import add from "../../assets/day_class_add.png";
import Swal from "sweetalert2";

import edit from "../../assets/edit.png";
import remove from "../../assets/remove.png";

export default function CreateOnlineClass_day_plan(props) {
	const {
		days,
		handleDayRemoveImg,
		onChangeImage_day,
		handleChange,
		handleRemoveDay,
		handleAddDay,
	} = props;

	const Toast = Swal.mixin({
		toast: true,
		position: "center-center",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	return (
		<div className="daydetail_all_wrapper">
			<div className="large_label" style={{ marginBottom: 20 }}>
				DAY별 클래스 상세 소개
			</div>
			<div className="dayclasswrapper">
				<div>
					{days.map((day) => (
						<div
							key={day.id}
							className="flex_center"
							style={{ flexDirection: "column" }}
						>
							<div className="day_title_label">{day.id}</div>
							<div className="flex_center">
								{day.dayVideopreview ? (
									<>
										<div className="background_day_img">
											<video
												src={day.dayVideopreview}
												style={{
													objectFit: "cover",
													width: "80%",
													maxHeight: 500,
													justifyContent: "center",
													maxWidth: "100%",
													height: "auto",
												}}
												controls
											/>

											<button
												className="editImg_text"
												onClick={() => {
													const inputElement = document.getElementById(
														`day_img_input_${day.id}`
													);
													if (inputElement) {
														inputElement.click();
													}
												}}
											>
												<img src={edit} width={22} alt="edit" />
											</button>
											<button
												className="editImg_text"
												style={{ top: 35 }}
												onClick={() => handleDayRemoveImg(day.id)}
											>
												<img src={remove} width={22} alt="edit" />
											</button>
										</div>
									</>
								) : (
									<>
										<button
											className="uploadImg_behind"
											onClick={() => {
												const inputElement = document.getElementById(
													`day_img_input_${day.id}`
												);
												if (inputElement) {
													inputElement.click();
												}
											}}
										>
											<img
												width="50"
												height="50"
												src="https://img.icons8.com/ios/50/image--v1.png"
												alt="--v1"
											/>
										</button>
									</>
								)}

								<input
									type="file"
									accept="video/*"
									id={`day_img_input_${day.id}`}
									style={{ display: "none" }}
									onChange={(e) => {
										const minSizeInBytes = 200 * 200;
										if (e.target.files[0].size < minSizeInBytes) {
											Toast.fire({
												icon: "error",
												title:
													"이미지/영상의 크기가 너무 작습니다. 다시 선택해주세요.",
											});
										} else {
											onChangeImage_day(e.target.files[0], `day_img_${day.id}`);
										}
									}}
								/>
							</div>
							<div>
								<div
									style={{
										width: "100%",
										display: "flex",
										flexDirection: "row",
									}}
								>
									<input
										className="day_input_text"
										style={{ width: "100%" }}
										type="text"
										maxLength={50}
										name={`title_${day.id}`}
										placeholder="제목"
										value={day.title}
										onChange={(e) =>
											handleChange(day.id, "title", e.target.value)
										}
									/>
									<input
										className="day_input_text"
										style={{ width: 250 }}
										type="text"
										multiple="false"
										name={`prepare_${day.id}`}
										placeholder="준비물"
										value={day.prepare}
										onChange={(e) =>
											handleChange(day.id, "prepare", e.target.value)
										}
									/>
								</div>

								<div style={{ justifyContent: "flex-start" }}>
									<textarea
										className="day_input_text"
										style={{ width: 950 }}
										type="text"
										multiple="true"
										name={`content_${day.id}`}
										placeholder="내용"
										value={day.content}
										onChange={(e) =>
											handleChange(day.id, "content", e.target.value)
										}
									/>
								</div>
							</div>
							<div style={{ border: "none" }}>
								{days.length > 1 && day.id === days[days.length - 1].id && (
									<button
										className="remove_button"
										style={{
											border: "none",
											backgroundColor: "transparent",
											margin: 5,
										}}
										onClick={() => handleRemoveDay(day.id)}
									>
										<img src={minus} width={25} alt="minus" />
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="add_button_wrapper">
				<button className="add_button" onClick={handleAddDay}>
					<img src={add} width={25} alt="minus" />
				</button>
			</div>
		</div>
	);
}
