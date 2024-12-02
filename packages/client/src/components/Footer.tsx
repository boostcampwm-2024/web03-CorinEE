export function Footer() {
	const footerLinks = [
		{
			text: 'GitHub',
			url: 'https://github.com/boostcampwm-2024/web03-CorinEE',
		},
		{
			text: 'Contact',
			url: 'https://github.com/boostcampwm-2024/web03-CorinEE?tab=readme-ov-file#-%ED%8C%80%EC%9B%90-%EC%86%8C%EA%B0%9C',
		},
		{
			text: 'Supported by',
			url: 'https://boostcamp.connect.or.kr/',
		},
		{
			text: 'With API',
			url: 'https://docs.upbit.com/',
		},
	];

	return (
		<footer className="w-full">
			<hr className="mt-10 border-gray-300" />
			<div className="pb-8 pt-4 flex-col mx-auto w-2/3 items-center justify-center">
				<div className="flex w-full justify-center gap-8">
					<div className="text-center">
						<span>&copy; Made by. Team 한강원정대</span>
					</div>
					{footerLinks.map(({ text, url }) => (
						<div key={text}>
							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-600 hover:text-blue-800 hover:underline"
							>
								{text}
							</a>
						</div>
					))}
				</div>
				<div className="text-center mt-3">
					<span className="text-sm text-gray-600">
          Corinee는 코인 투자에 대한 사용자의 흥미를 돋우고 실력 성장을 위한 모의 투자 플랫폼일뿐, 투자 제안, 권유, 또는 종목 추천을 목적으로 제공되는 서비스가 아닙니다.
					</span>
				</div>
			</div>
		</footer>
	);
}
