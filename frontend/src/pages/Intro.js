//소개 및 이용방법 화면
import React from "react";
import "../styles/Intro.css";
import Intro1 from "../../src/assets/Intro1.png";
import GropBying from "../../src/assets/GropBying.png";
import Intro3 from "../../src/assets/Intro3.png";
import HorizonLine from "../common/HorizonLine";

function Intro(props) {
	return (
		<div className="intro_wrap">
			<img className="intro1" alt="" src={Intro1} />
			<div className="text_wrap">
				<p className="text">Special time just for me,</p>
				<p className="text">Hobby For You</p>
			</div>
			<div className="intro">
				{/* 애니메이션 효과 들어가는 텍스트 */}
				<p className="intro_text">누구나 쉽고 재미있게</p>
			</div>
			<div className="intro2_title">
				{/* 수평 구분선 사용 */}
				<HorizonLine text="Mentor" />
			</div>

			<div className="intro2_grid">
				<div className="grid_detail">
					<img
						src="https://img.icons8.com/ios-filled/50/null/decision-making.png"
						alt=""
					/>
					<div className="detail_title">멘토의 자율 결정 </div>
					<div className="detail">
						멘토는 자신의 능력과 경험에 따라 적정한 인원수와 수강료를 스스로
						결정 할 수 있으며, 이를 통해 보다 맞춤화된 클래스를 제공할 수
						있습니다.
					</div>
				</div>

				<div className="grid_detail">
					<img
						src="https://img.icons8.com/ios/50/null/idea-sharing--v1.png"
						alt=""
					/>
					<div className="detail_title">나만의 취미 공유 </div>
					<div className="detail">
						자신의 취미를 다른 사람과 공유함으로써 성취감을 느끼고 자신감이
						향상되며, 더불어 다양한 시각과 경험을 얻을 수 있습니다. 자신감을
						더욱 향상시키고 더 다양한 시각과 경험을 쌓아보세요
					</div>
				</div>
				<div className="grid_detail">
					<img
						src="https://img.icons8.com/ios/50/null/financial-success.png"
						alt=""
					/>
					<div className="detail_title">수입 창출 </div>
					<div className="detail">
						자신의 취미나 전문 분야에 대한 지식을 공유하면서 동시에 부가적인
						수입을 창출할 수 있습니다.
					</div>
				</div>
			</div>
			<div className="intro2_title">
				<HorizonLine text="Mentor" />
			</div>
			<div className="intro2_grid">
				<div className="grid_detail">
					<img src={GropBying} alt="" style={{ width: 55, height: 50 }} />
					<div className="detail_title">공구 시스템으로 인한 비용 절감</div>
					<div className="detail">
						한 클래스에 많은 멘티가 신청을 할수록, 각 멘티는 더 저렴한 수강료로
						클래스를 이수할 수 있습니다. 이점을 놓치지 마시고, 더 저렴한
						가격으로 클래스를 이수해 보세요!
					</div>
				</div>

				<div className="grid_detail">
					<img
						src="https://img.icons8.com/external-parzival-1997-detailed-outline-parzival-1997/64/null/external-improve-achievement-planning-parzival-1997-detailed-outline-parzival-1997-1.png"
						alt=""
						style={{ width: 50, height: 50 }}
					/>
					<div className="detail_title">긍정적 영향 </div>
					<div className="detail">
						일상 속 나만의 시간을 가지면 긍정적인 정서를 불러일으키며, 작은
						성취감과 성공을 경험하며 자존감이 높아질 수 있습니다.
					</div>
				</div>
				<div className="grid_detail">
					<img
						src="https://img.icons8.com/external-outline-geotatah/64/null/external-review-festivalization-and-exhibition-outline-geotatah.png"
						alt=""
						style={{ width: 53, height: 53 }}
					/>
					<div className="detail_title">맞춤 클래스 검색</div>
					<div className="detail">
						원하는 클래스를 찾기 어려울 때 테마별 검색과 필터링 검색, 그리고
						인기 BEST 10 등을 통해 개인 맞춤형 클래스를 쉽게 찾아보세요.
					</div>
				</div>
			</div>
			{/* Mentor가 되려면? */}
			<img src={Intro3} className="intro3" alt="" />
		</div>
	);
}

export default Intro;
