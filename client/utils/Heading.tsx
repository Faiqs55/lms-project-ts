import React, { FC } from "react";

interface Props {
  title: string;
  desc: string;
  keywords: string;
}
const Heading: FC<Props> = ({ title, desc, keywords }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords} />
    </>
  );
};

export default Heading;
