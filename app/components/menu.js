import React from 'react'
import betting from '../../public/images/betting.png';
import home from '../../public/images/home.png';
import profile from '../../public/images/profile.png';
import fight from '../../public/images/fight.png';
import terms from '../../public/images/terms.png';
import transhistory from '../../public/images/transhistory.png';
import MenuItem from './menuItem';

const menus = [
    {
        href: "/",
        icon: home,
        label: "Home"
    }, {
        href: "/profile_menu",
        icon: profile,
        label: "Profile"
    }, {
        href: "/fight_schedule",
        icon: fight,
        label: "Game Schedule"
    }, {
        href: "/transaction_history",
        icon: transhistory,
        label: "Transaction History"
    }, {
        href: "/betting_history",
        icon: betting,
        label: "Betting History"
    }, {
        href: "/terms_services",
        icon: terms,
        label: "Terms of Use"
    },
]

export default function Menu({isEnabled}) {
    return (
        <ul className="p-5 sidebar-nav leading-relaxed text-xl">
            {menus.map((object, i) => {
                return <React.Fragment key={`li-${i}`}>
                    <li>
                        <MenuItem
                            isEnabled={isEnabled}
                            href={object.href}
                            icon={object.icon}
                            label={object.label}>
                        </MenuItem>
                    </li>
                </React.Fragment>
            })}
        </ul>
    )
}
