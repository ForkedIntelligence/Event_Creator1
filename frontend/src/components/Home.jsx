import React from "react";
import { FaPencilAlt, FaSpellCheck, FaSyncAlt } from "react-icons/fa";
import ai from "../images/Etherio_Event_Management_AI.png";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-6 h-screen flex items-center">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Create An Event
              </h2>
              <p className="text-xl mb-8">
                Unleash the power of artificial intelligence to perfect your
                event creation.
              </p>
              <Link
                to="/write"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-100 transition duration-300"
              >
                Create Event
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                style={{ height: "auto" }}
                src={ai}
                alt="AI Writing"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>
          AI Writing Assistant ©{new Date().getFullYear()} | Powered by
          Masynctech Coding School
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-lg shadow-lg text-center">
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;