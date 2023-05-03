//footer 문의
import React from "react";
import "../styles/Header.css";
import "../styles/Footer.css";

// import Intro from "../pages/Intro";

function Footer(props) {
	return (
		<div className="footer_wrap">
			<div className="container">
				<div className="footer">
					<div className="footer_title">Introduction</div>
					<div className="footer_content">
						Welcome to hobby4u. You can see how to use our site and the benefits
						of working as a mentor and mentee at a glance. As soon as you see
						it, you want to start right now. &nbsp;
						<a
							href="../Intro"
							style={{
								textDecoration: "underline",
								color: "gray",
								textAlign: "end",
							}}
						>
							View
						</a>
					</div>
				</div>
				<div className="footer">
					<div className="footer_title">Searching for a Class</div>
					<div className="footer_content">
						Search for various classes created by mentors. Each class can be
						searched according to the theme, and it can be searched by title and
						introduction. &nbsp;
						<a
							href="../Intro"
							style={{
								textDecoration: "underline",
								color: "gray",
								textAlign: "end",
							}}
						>
							Go to search
						</a>
					</div>
				</div>
				<div className="footer">
					<div className="footer_title">Create Your Own Class</div>
					<div className="footer_content">
						Anyone can be a mentor. Create and share your own hobby class with
						mentees. You can provide a more satisfactory class by setting the
						number of students and tuition fees yourself. &nbsp;
						<a
							href="../Intro"
							style={{
								textDecoration: "underline",
								color: "gray",
								textAlign: "end",
							}}
						>
							Go to create a class.
						</a>
					</div>
				</div>
			</div>
			<div className="line"></div>
			<div className="hobby4u_wrapper">
				<div className="hobby4u">Hobby4U</div>
				<div className="contact">
					<div className="email">hobby4u@gmail.com</div>
					<div className="icon8">@icon8</div>
				</div>
			</div>
		</div>
	);
}

export default Footer;
