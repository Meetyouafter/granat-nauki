import { type ToggleEvent, useId, useRef } from 'react';
import { matchPath, NavLink, useLocation } from 'react-router';

import classNames from 'classnames';

import { ChevronIcon } from '@shared/ui/icons';

import type { NavGroupItem } from '../model/navItems';

import styles from './Header.module.scss';

const NavDropdown = ({ label, items }: NavGroupItem) => {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const isActive = items.some(({ to }) => matchPath({ path: to, end: false }, pathname));

  // The menu is a popover (top layer), so the nav's overflow doesn't clip it,
  // but it has to be placed under the trigger by hand.
  const handleBeforeToggle = (event: ToggleEvent<HTMLDivElement>) => {
    const trigger = triggerRef.current;
    if (event.newState !== 'open' || !trigger) return;
    const { left, bottom } = trigger.getBoundingClientRect();
    event.currentTarget.style.top = `${String(bottom)}px`;
    event.currentTarget.style.left = `${String(left)}px`;
  };

  const handleItemClick = () => {
    menuRef.current?.hidePopover();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={menuId}
        className={classNames(styles.link, styles.dropdownTrigger, isActive && styles.linkActive)}
      >
        {label}
        <ChevronIcon className={styles.dropdownChevron} />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        popover="auto"
        className={styles.dropdownMenu}
        onBeforeToggle={handleBeforeToggle}
      >
        {items.map(({ label: itemLabel, to }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleItemClick}
            className={({ isActive: isItemActive }) =>
              classNames(styles.dropdownItem, isItemActive && styles.dropdownItemActive)}
          >
            {itemLabel}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default NavDropdown;
