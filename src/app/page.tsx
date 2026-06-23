"use client";
import { Card, CardBody, CardFooter } from "@heroui/react";
import Image from "next/image";

type Feature = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  body: string;
};

const features: Feature[] = [
  {
    src: "/Forms.png",
    alt: "Consistent Data",
    width: 2800,
    height: 1260,
    title: "Consistent Data",
    body: "With ACE web forms your data will always be consistent. With robust form validation, we ensure the quality and accuracy of your data.",
  },
  {
    src: "/PBIDash.png",
    alt: "Powerful Analytics",
    width: 1527,
    height: 877,
    title: "Powerful Analytics",
    body: "Gain powerful insights into your project with analytics powered by Power BI. See your SPI and CPI curves over time to track your project's progress.",
  },
  {
    src: "/imports.jpg",
    alt: "Data Imports",
    width: 1261,
    height: 654,
    title: "Data Imports",
    body: "With data integration, we can take your existing infrastructure and import it into a single central location.",
  },
  {
    src: "/mobile.jpg",
    alt: "Mobile Friendly",
    width: 900,
    height: 500,
    title: "Mobile Friendly",
    body: "ACE web forms let you enter data in the field with any mobile device. Don't wait to get back to the office to start entering your data.",
  },
  {
    src: "/cloud.jpg",
    alt: "Anywhere Access",
    width: 900,
    height: 550,
    title: "Anywhere Access",
    body: "ACE web forms store your data in the cloud, so you can access it anywhere, at any time, on any device.",
  },
  {
    src: "/secure.jpg",
    alt: "Data Security",
    width: 280,
    height: 180,
    title: "Data Security",
    body: "Rest assured that your data is secure. ACE web forms use modern security practices to ensure the highest level of security.",
  },
];

export default function Home() {
  return (
    <div className="w-full bg-primary-50 p-6 sm:p-12">
      <h1 className="text-3xl font-semibold text-center text-primary">
        Ace Project Services
      </h1>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <CardBody className="flex flex-row justify-center">
              <Image
                src={f.src}
                alt={f.alt}
                width={f.width}
                height={f.height}
                className="w-full max-w-[400px] h-auto"
              />
            </CardBody>
            <CardFooter>
              <div className="flex flex-col">
                <h2 className="text-2xl text-center">{f.title}</h2>
                <p className="mt-2">{f.body}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
