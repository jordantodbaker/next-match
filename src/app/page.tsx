"use client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import Link from "next/link";
import { FaRegSmile } from "react-icons/fa";

export default function Home() {
  return (
    <div className="w-full p-18 bg-blue-100">
      <div className="flex justify-center">
        <h1 className="text-3xl">Ace Project Services</h1>
      </div>
      <div className="flex flex-row justify-between mt-16">
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image src="../../Forms.png" width={400} className="object-top" />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Consistent Data</h1>
              <p className="mt-2">
                With ACE web forms your data will data will alway be consistent.
                With robust form validation, we can ensure the quality and
                accuracy of your data
              </p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image src="../../PBIDash.png" width={400} />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Powerful Analytics</h1>
              <p className="mt-2">
                Gain powerful insights into your project with analytics powered
                by Power BI.
              </p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image src="../../imports.jpg" width={400} />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Data Imports</h1>
              <p className="mt-2">
                With ACE web forms your data will data will alway be consistent.
                With robust form validation, we can ensure the quality and
                accuracy of your data
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-row justify-between mt-16">
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image src="../../mobile.jpg" width={400} />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Mobile Friendly</h1>
              <p className="mt-2">
                With ACE web forms your data will data will alway be consistent.
                With robust form validation, we can ensure the quality and
                accuracy of your data
              </p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image src="../../cloud.jpg" width={400} />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Anywhere Access</h1>
              <p className="mt-2">
                With ACE web forms your data will data will alway be consistent.
                With robust form validation, we can ensure the quality and
                accuracy of your data
              </p>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-1/4">
          <CardBody className="flex flex-row justify-center">
            <Image src="../../secure.jpg" width={400} />
          </CardBody>
          <CardFooter>
            <div className="flex flex-col">
              <h1 className="text-3xl text-center">Data Security</h1>
              <p className="mt-2">
                With ACE web forms your data will data will alway be consistent.
                With robust form validation, we can ensure the quality and
                accuracy of your data
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
