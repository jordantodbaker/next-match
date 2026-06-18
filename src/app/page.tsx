"use client";
import { Card, CardBody, CardFooter } from "@heroui/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full p-18 bg-blue-100">
      <div className="flex justify-center">
        <h1 className="text-3xl">Ace Project Services</h1>
      </div>
      <div className="flex flex-row justify-between mt-16">
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image
              src="/Forms.png"
              alt="Consistent Data"
              width={2800}
              height={1260}
              className="w-[400px] h-auto object-top"
            />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Consistent Data</h1>
              <p className="mt-2">
                With ACE web forms your data will data will alway be consistent.
                With robust form validation, we can ensure the quality and
                accuracy of your data.
              </p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image
              src="/PBIDash.png"
              alt="Powerful Analytics"
              width={1527}
              height={877}
              className="w-[400px] h-auto"
            />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Powerful Analytics</h1>
              <p className="mt-2">
                Gain powerful insights into your project with analytics powered
                by Power BI. See your SPI and CPI curves over time to track your
                project's progress.
              </p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image
              src="/imports.jpg"
              alt="Data Imports"
              width={1261}
              height={654}
              className="w-[400px] h-auto"
            />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Data Imports</h1>
              <p className="mt-2">
                With data integration, we can take your existing infrastructure
                and import it into a single central location.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-row justify-between mt-16">
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image
              src="/mobile.jpg"
              alt="Mobile Friendly"
              width={900}
              height={500}
              className="w-[400px] h-auto"
            />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Mobile Friendly</h1>
              <p className="mt-2">
                ACE web forms will allow you to enter data in the field with any
                mobile device. Don't wait to get back to the office to start
                entering your data.
              </p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image
              src="/cloud.jpg"
              alt="Anywhere Access"
              width={900}
              height={550}
              className="w-[400px] h-auto"
            />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Anywhere Access</h1>
              <p className="mt-2">
                Ace web forms store your data in the cloud. This means that you
                can access your data anywhere, at any time, on any device.
              </p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image
              src="/secure.jpg"
              alt="Data Security"
              width={280}
              height={180}
              className="w-[400px] h-auto"
            />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Data Security</h1>
              <p className="mt-2">
                Rest assured that your data is secure. ACE web forms use modern
                security practices to ensure the highest level of security.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
