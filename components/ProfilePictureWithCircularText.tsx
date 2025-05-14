import React from "react";
import CircularText from "@/src/blocks/TextAnimations/CircularText/CircularText";

interface ProfilePictureWithCircularTextProps {
  imageSrc: string;
  imageAlt: string;
  circularText: string;
  className?: string;
}

const ProfilePictureWithCircularText: React.FC<
  ProfilePictureWithCircularTextProps
> = ({ imageSrc, imageAlt, circularText, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-72 h-72 md:w-96 md:h-96">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse" />

        {/* Profile picture container */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl shadow-purple-500/20">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl" />

        {/* Circular Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <CircularText
            text={circularText}
            spinDuration={20}
            onHover="slowDown"
            className="!w-[300px] !h-[300px] md:!w-[450px] md:!h-[450px] text-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureWithCircularText;
