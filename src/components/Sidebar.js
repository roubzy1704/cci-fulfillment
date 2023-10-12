import React from 'react';
import '../css/Sidebar.css';

const SidebarItem = ({ item, isActive, onClick }) => (
  <li 
    className={isActive ? 'active' : ''} 
    onClick={() => onClick(item)}
  >
    {item.label}
  </li>
);

const Sidebar = ({ items, activeItem, onItemSelect }) => (
  <aside>
    <ul>
      {items.map(item => (
        <SidebarItem 
          key={item.id} 
          item={item} 
          isActive={item.id === activeItem.id}
          onClick={onItemSelect}
        />
      ))}
    </ul>
  </aside>
);

export default Sidebar;
