import { Link } from 'react-router-dom';

const Sidebar = ({ labels }) => {
  return (
    <div className="bg-purple-100 w-64 p-4 flex flex-col gap-2 min-h-screen">
      <Link to="/profile" className="hover:underline">Profile</Link>
      <Link to="/labels" className="hover:underline">Labels</Link>
      {labels?.map((label) => (
        <Link key={label._id} to={`/label/${label._id}`} className="hover:underline">
          {label.name}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;