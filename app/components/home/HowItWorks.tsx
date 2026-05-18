'use client';

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import {
  Search,
  Send,
  CheckCircle,
  PlusCircle,
  Users,
  Briefcase
} from "lucide-react";
import StepCard from "./StepCard";

const jobSeekerSteps = [
  {
    title: "Search Jobs",
    description: "Browse thousands of tech jobs tailored to you",
    icon: Search,
  },
  {
    title: "Apply",
    description: "Submit applications in just a few clicks",
    icon: Send,
  },
  {
    title: "Get Hired",
    description: "Land your dream role faster",
    icon: CheckCircle,
  },
];

const employerSteps = [
  {
    title: "Post Job",
    description: "Create listings and attract top talent",
    icon: PlusCircle,
  },
  {
    title: "Review Applicants",
    description: "Filter and evaluate candidates",
    icon: Users,
  },
  {
    title: "Hire Talent",
    description: "Build your dream team",
    icon: Briefcase,
  },
];

const Connector = () => (
  <div className="hidden md:flex items-center flex-1 mx-4">
    <div className="relative w-full h-0.5 bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_12px_#fff]"
          style={{
            left: `${i * 30}%`,
          }}
          animate={{
            x: ["0%", "200%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-16 bg-[#0A0A0F]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="relative text-2xl sm:text-3xl font-bold text-white mb-10">
          How It Works
        </h2>

        <Tabs.Root defaultValue="job-seekers">
          <Tabs.List className="flex gap-4 mb-10">
            <Tabs.Trigger
              value="job-seekers"
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                bg-zinc-800 text-white
                data-[state=active]:bg-linear-to-r
                data-[state=active]:from-cyan-500
                data-[state=active]:to-purple-500
              "
            >
              For Job Seekers
            </Tabs.Trigger>

            <Tabs.Trigger
              value="employers"
              className="px-4 py-2 rounded-lg text-sm font-medium
              bg-zinc-800 text-white
              data-[state=active]:bg-linear-to-r
              data-[state=active]:from-pink-500
              data-[state=active]:to-orange-500"
            >
              For Employers
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="job-seekers">
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <StepCard {...jobSeekerSteps[0]} />
              <Connector />
              <StepCard {...jobSeekerSteps[1]} />
              <Connector />
              <StepCard {...jobSeekerSteps[2]} />
            </div>

            <div className="flex justify-center">
              <button className="mt-12 px-6 py-3 rounded-lg
                gradient-cyan-purple
                text-white font-semibold
                hover:opacity-90 transition"
                >
                Get Started
              </button>
            </div>
          </Tabs.Content>

          <Tabs.Content value="employers">
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <StepCard {...employerSteps[0]} />
              <Connector />
              <StepCard {...employerSteps[1]} />
              <Connector />
              <StepCard {...employerSteps[2]} />
            </div>

            <div className="flex justify-center">
              <button className="
                mt-12 px-6 py-3 rounded-lg
                gradient-pink-orange
                text-white font-semibold
                hover:opacity-90 transition
              ">
                Post a Job
              </button>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </section>
  );
}

export default HowItWorks