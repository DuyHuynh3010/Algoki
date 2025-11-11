import { Book1, Heart, Profile2User } from "iconsax-react";

export const LIST_FOUNDATION = [
  {
    title: 'Flexible classes',
    description: 'Courses are designed for different learning needs and schedules, empowering students to choose the time and pace that suit them best.',
    icon: <div className="h-12 w-12 rounded-full bg-infor/16 flex items-center justify-center">
      <Heart size={24} color="#0288D1"/>
    </div>
  },
  {
    title: 'Learn anywhere',
    description: 'With an internet-enabled device, learners can access Algoki’s rich lesson library anytime, anywhere, keeping their learning journey uninterrupted.',
    icon: <div className="h-12 w-12 rounded-full bg-secondary-main/16 flex items-center justify-center">
      <Book1 size={24} color="#FFB145"/>
    </div>
  },
  {
    title: 'Experienced instructors',
    description: 'Algoki brings together outstanding instructors with years of teaching and research experience to deliver high-quality, inspiring lessons that are easy to follow.',
    icon: <div className="h-12 w-12 rounded-full bg-success/16 flex items-center justify-center">
      <Profile2User size={24} color="#388E3C"/>
    </div>
  }
]