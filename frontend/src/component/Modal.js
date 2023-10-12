import React, { useState, useEffect } from "react";
import "../styles/Modal.css";

export const Modal = ({ isOpen, onClose, onSave }) => {
	const [inputLink, setInputLink] = useState("");

	useEffect(() => {
		if (isOpen) {
			setInputLink("");
		}
	}, [isOpen]);

	const handleSave = () => {
		onSave(inputLink); // onSave 콜백을 호출하여 이메일 값을 전달
		onClose();
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
					type="link"
					placeholder="링크를 입력해주세요"
					value={inputLink}
					onChange={(e) => setInputLink(e.target.value)}
				/>
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
