import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import { BsExclamationTriangle } from "react-icons/bs";

export const Modal = ({ isOpen, onClose, onSave }) => {
	const [inputTitle, setInputTitle] = useState(""); // 제목 입력 상태
	const [inputLink, setInputLink] = useState(""); // 링크 입력 상태
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (isOpen) {
			setInputTitle("");
			setInputLink("");
			setErrorMessage("");
		}
	}, [isOpen]);

	// const handleTitleChange = (e) => {
	// 	setInputLink({ ...inputLink, title: e.target.value });
	// };

	// const handleLinkChange = (e) => {
	// 	setInputLink({ ...inputLink, link: e.target.value });
	// };

	const handleSave = () => {
		if (inputTitle && inputLink) {
			if (isValidURL(inputLink)) {
				onSave({ title: inputTitle, link: inputLink }); // 입력된 데이터를 부모 페이지로 전달
				setInputTitle(""); // 입력 필드 초기화
				setInputLink(""); // 입력 필드 초기화
				onClose(); // 모달을 닫습니다.
			} else {
				setErrorMessage("유효하지 않은 링크입니다. ");
			}
		} else {
			setErrorMessage("제목과 링크를 모두 입력해주세요.");
		}
	};

	const isValidURL = (url) => {
		const pattern = /^(http|https):\/\//;
		return pattern.test(url);
	};

	return (
		<div className={`modal ${isOpen ? "open" : "closed"}`}>
			<div className="modal-content">
				<input
					style={{
						width: 550,
						padding: 8,
						marginTop: 25,
						marginBottom: 5,
						border: "1px solid gray",
						borderRadius: 10,
						display: "flex",
						justifyContent: "center",
					}}
					type="text"
					placeholder="제목을 입력해주세요"
					value={inputTitle}
					onChange={(e) => setInputTitle(e.target.value)}
				/>
				<input
					style={{
						width: 550,
						padding: 8,
						marginTop: 25,
						marginBottom: 5,
						border: "1px solid gray",
						borderRadius: 10,
						display: "flex",
						justifyContent: "center",
					}}
					type="text"
					placeholder="링크를 입력해주세요"
					value={inputLink}
					onChange={(e) => setInputLink(e.target.value)}
				/>

				{errorMessage && (
					<div
						style={{
							width: "90%",
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							// justifyContent: "flex-start",
							// backgroundColor: "yellow",
						}}
					>
						<div
							style={{
								// backgroundColor: "yellow",
								alignItems: "center",
								display: "flex",
								margin: 10,
							}}
						>
							<BsExclamationTriangle color="#FD5D5D" size={16} />
						</div>
						<div style={{ color: "#fd5d5d", fontSize: 14 }}>{errorMessage}</div>
					</div>
				)}
				<div className="modal-buttons">
					<button className="buttons" onClick={handleSave}>
						저장
					</button>
					<button className="buttons" onClick={onClose}>
						취소
					</button>
				</div>
			</div>
		</div>
	);
};
