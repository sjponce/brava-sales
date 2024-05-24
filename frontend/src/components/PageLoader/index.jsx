import { Spin } from "antd";
import React from "react";

const PageLoader = () => {
	return (
		<div className="centerAbsolute">
			<Spin size="large" />
		</div>
	);
};
export default PageLoader;
