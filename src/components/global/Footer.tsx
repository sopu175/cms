'use client';
import React from 'react';
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from 'lucide-react';
import SocialIcons from "@/components/global/SocialIcons";
import {useGlobalData} from "@/context/GlobalContext";

interface MenuItem {
    id: number;
    menu_id: number;
    parent_id: number;
    item_title: string;
    item_type: string | null;
    item_desc: string;
    item_url: string;
    item_target: string;
    item_icon: string;
    sort_order: number;
    items: MenuItem[];
}

interface Office {
    label: string;
    address: string;
}

interface FooterData {
    logo?: string;
    secondaryLogo?: string;
    descriptions?: string[];
    menus?: {
        menuList1?: MenuItem[];
        menuList2?: MenuItem[];
        menuList3?: MenuItem[];
        menuList4?: MenuItem[];
    };
    contact?: {
        emails?: string[];
        phones?: string[];
        offices?: Office[];
    };
    socialMedia?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        youtube?: string;
    };
    copyright?: string;
    siteCredit?: string;
}

interface FooterProps {
    data?: FooterData;
}

const Footer: React.FC<FooterProps> = ({data}) => {
    const {  menuData } = useGlobalData();
    // Define the type for the footer_menu structure
    type FooterMenuData = {
        data: MenuItem[];
        social_links?: { name: string; icon: string; url: string }[];
        additional_info?: {
            logo?: { primary?: string; secondary?: string };
            contact_info?: string[];
            address?: { name: string; address: string; google_map?: string }[];
            phone_numbers?: string[];
            email_address?: string[];
            copyright?: string;
            siteCredit?: string;
        };
        additional_links?: { label: string; path: string; target_window: string }[];
    };
    const footerMenu = menuData?.footer_menu as FooterMenuData | undefined;

    // Extract according to new structure if data is not provided
    let logo: string | undefined = undefined;
    let secondaryLogo: string | undefined = undefined;
    let descriptions: string[] | undefined = undefined;
    let menus: {
        menuList1?: MenuItem[];
        menuList2?: MenuItem[];
        menuList3?: MenuItem[];
        menuList4?: MenuItem[];
    } | undefined = undefined;
    let socialMedia: Record<string, string> | undefined = undefined;
    let copyright: string | undefined = undefined;
    let contact: {
        emails?: string[];
        phones?: string[];
        offices?: { label: string; address: string }[];
    } | undefined = undefined;
    let siteCredit: string | undefined = undefined;

    if (!data && footerMenu) {
        // logo and secondaryLogo
        logo = footerMenu.additional_info?.logo?.primary;
        secondaryLogo = footerMenu.additional_info?.logo?.secondary;
        // descriptions
        descriptions = footerMenu.additional_info?.contact_info;
        // menus: convert array to object structure
        if (Array.isArray(footerMenu.data)) {
            menus = {};
        } else {
            menus = footerMenu.data as typeof menus;
        }
        // socialMedia: convert array to object for easier use
        if (Array.isArray(footerMenu.social_links)) {
            socialMedia = {};
            footerMenu.social_links.forEach((item) => {
                if (item.name && item.url) {
                    socialMedia![item.name.toLowerCase()] = item.url;
                }
            });
        }
        // copyright, siteCredit, contact
        copyright = footerMenu.additional_info?.copyright;
        siteCredit = footerMenu.additional_info?.siteCredit;
        contact = {
            emails: footerMenu.additional_info?.email_address,
            phones: footerMenu.additional_info?.phone_numbers,
            offices: Array.isArray(footerMenu.additional_info?.address)
                ? footerMenu.additional_info.address.map((a) => ({ label: a.name, address: a.address }))
                : undefined
        };
    }

    if (data) {
        const { logo: dLogo, secondaryLogo: dSecondaryLogo, descriptions: dDescriptions, menus: dMenus, contact: dContact, socialMedia: dSocialMedia, copyright: dCopyright, siteCredit: dSiteCredit } = data;
        logo = dLogo;
        secondaryLogo = dSecondaryLogo;
        descriptions = dDescriptions;
        contact = dContact;
        socialMedia = dSocialMedia;
        copyright = dCopyright;
        siteCredit = dSiteCredit;
        // Ensure menus is always the expected object type
        menus = (dMenus && !Array.isArray(dMenus)) ? dMenus : {};
    }

    if (!logo && !secondaryLogo && !descriptions && !menus && !contact && !socialMedia && !copyright && !siteCredit) {
        return null;
    }

    const socialIcons = {
        facebook: Facebook,
        twitter: Twitter,
        linkedin: Linkedin,
        instagram: Instagram,
        youtube: Youtube,
    };

    // Check if any menu has items
    const hasMenus = menus && Object.values(menus).some(menu => Array.isArray(menu) && menu.length > 0);

    // Get available menus
    const availableMenus = menus ? Object.entries(menus).filter(([key, menu]) => Array.isArray(menu) && menu.length > 0) : [];

    // Check if contact section has content
    const hasContact = contact && (
        (contact.emails && contact.emails.length > 0) ||
        (contact.phones && contact.phones.length > 0) ||
        (contact.offices && contact.offices.length > 0)
    );

    // Check if social media has content
    const hasSocialMedia = socialMedia && Object.values(socialMedia).some(url => url);

    // Check if company info section has content
    const hasCompanyInfo = (logo || secondaryLogo) || (descriptions && descriptions.length > 0) || hasSocialMedia;

    const menuTitles = {
        menuList1: "Company",
        menuList2: "Resources",
        menuList3: "Legal",
        menuList4: "News"
    };

    const renderMenuColumn = (menuItems: MenuItem[], title: string) => {
        return (
            <div className="group">
                <div className="relative mb-8">
                    <h3 className="text-xl font-bold text-white mb-2 relative">
                        {title}
                        <div
                            className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full group-hover:w-20 transition-all duration-500"></div>
                    </h3>
                </div>
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.id} className="transform transition-all duration-300 hover:translate-x-2">
                            <a
                                href={item.item_url}
                                target={item.item_target}
                                className="group/link flex items-center text-gray-300 hover:text-white transition-all duration-300 text-sm relative overflow-hidden"
                                title={item.item_desc}
                            >
                                <div className="flex items-center space-x-3 relative z-10">
                                    <div
                                        className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover/link:bg-blue-400 group-hover/link:shadow-lg group-hover/link:shadow-blue-400/50 transition-all duration-300"></div>
                                    <span className="relative">
                                        {item.item_title}
                                        {item.item_target === '_blank' && (
                                            <ExternalLink size={12}
                                                          className="inline ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"/>
                                        )}
                                    </span>
                                </div>
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover/link:translate-x-full transition-transform duration-700"></div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderContactSection = () => {
        if (!hasContact) return null;

        return (
            <div className="group">
                <div className="relative mb-8">
                    <h3 className="text-xl font-bold text-white mb-2 relative">
                        Contact
                        <div
                            className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full group-hover:w-20 transition-all duration-500"></div>
                    </h3>
                </div>
                <div className="space-y-6">
                    {/* Email + Phone Flex Row */}
                    <div className="flex flex-wrap gap-6">
                        {/* Email */}
                        {contact?.emails && contact.emails?.length > 0 && (
                            <div className="flex-1 min-w-[250px] group/contact">
                                <div className="flex items-center gap-3 text-white mb-3">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover/contact:shadow-blue-500/40 transition-all duration-300">
                                        <Mail size={16}/>
                                    </div>
                                    <span className="font-semibold text-sm">Email</span>
                                </div>
                                {contact.emails.map((email, idx) => (
                                    <a
                                        key={idx}
                                        href={`mailto:${email}`}
                                        className="block text-sm text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 relative group/email"
                                    >
                                        <span className="relative z-10">{email}</span>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover/email:opacity-100 transition-opacity duration-300 rounded"></div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Phone */}
                        {contact?.phones && contact.phones?.length > 0 && (
                            <div className="flex-1 min-w-[250px] group/contact">
                                <div className="flex items-center gap-3 text-white mb-3">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25 group-hover/contact:shadow-green-500/40 transition-all duration-300">
                                        <Phone size={16}/>
                                    </div>
                                    <span className="font-semibold text-sm">Phone</span>
                                </div>
                                {contact.phones.map((phone, idx) => (
                                    <a
                                        key={idx}
                                        href={`tel:${phone}`}
                                        className="block text-sm text-gray-300 hover:text-green-400 transition-all duration-300 hover:translate-x-1 relative group/phone"
                                    >
                                        <span className="relative z-10">{phone}</span>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover/phone:opacity-100 transition-opacity duration-300 rounded"></div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Offices Grid (max 2 per row) */}
                    {contact?.offices && contact.offices?.length > 0 && (
                        <div className="group/contact">
                            <div className="flex items-center gap-3 text-white mb-3">
                                <div
                                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover/contact:shadow-purple-500/40 transition-all duration-300">
                                    <MapPin size={16}/>
                                </div>
                                <span className="font-semibold text-sm">Offices</span>
                            </div>

                            <div className="ml-11 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {contact.offices.map((office, idx) => (
                                    <div key={idx} className="group/office relative">
                                        <div
                                            className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-purple-500 to-transparent opacity-30 group-hover/office:opacity-60 transition-opacity duration-300"></div>
                                        <div className="pl-4">
                                            <p className="text-sm font-semibold text-white mb-1">{office.label}</p>
                                            <p className="text-xs text-gray-300 leading-relaxed">{office.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };


    return (
        <div
            className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-gray-300 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.1),transparent_50%)]"/>
                <div
                    className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.1),transparent_50%)]"/>
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"/>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main Content */}
                <div
                    className={`grid gap-16 ${hasCompanyInfo && (hasMenus || hasContact) ? 'lg:grid-cols-12' : 'lg:grid-cols-1'}`}>
                    {/* Company Info Section */}
                    {hasCompanyInfo && (
                        <div className={`space-y-10 ${(hasMenus || hasContact) ? 'lg:col-span-4' : 'text-center'}`}>
                            {/* Logos */}
                            {(logo || secondaryLogo) && (
                                <div className={`flex items-center gap-6 ${!(hasMenus || hasContact) ? 'justify-center' : ''}`}>
                                    {logo && (
                                        <div className="relative group">
                                            <img
                                                src={logo}
                                                alt="Company Logo"
                                                className="h-14 w-auto rounded-lg shadow-2xl group-hover:shadow-blue-500/25 transition-shadow duration-300"
                                            />
                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    )}
                                    {secondaryLogo && (
                                        <img
                                            src={secondaryLogo}
                                            alt="Secondary Logo"
                                            className="h-12 w-auto rounded-lg shadow-lg hover:shadow-purple-500/25 transition-shadow duration-300"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Descriptions */}
                            {descriptions && descriptions.length > 0 && (
                                <div className={`space-y-4 ${!(hasMenus || hasContact) ? 'text-center max-w-3xl mx-auto' : ''}`}>
                                    {descriptions.map((desc, idx) => (
                                        <p key={idx} className="text-gray-300 text-base leading-relaxed relative group">
                                            <span className="relative z-10">{desc}</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded" />
                                        </p>
                                    ))}
                                </div>
                            )}

                            {/* Social Media */}
                            {hasSocialMedia && (
                                // <div className={!(hasMenus || hasContact) ? 'flex justify-center' : ''}>
                                //     {renderSocialMedia()}
                                // </div>
                                <SocialIcons
                                    items={Object.entries(socialMedia || {}).filter(([_, url]) => url).map(([platform, url]) => ({
                                        icon: socialIcons[platform as keyof typeof socialIcons],
                                        url,
                                        tooltip: `Follow us on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
                                    }))}
                                />
                            )}
                        </div>
                    )}

                    {/* Navigation Menus & Contact */}
                    {(hasMenus || hasContact) && (
                        <div className={`${hasCompanyInfo ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                            <div className={`grid gap-12 ${(() => {
                                const totalCols = availableMenus.length + (hasContact ? 1 : 0);
                                if (totalCols === 1) return 'grid-cols-1';
                                if (totalCols === 2) return 'grid-cols-1 lg:grid-cols-2';
                                if (totalCols === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
                                if (totalCols === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
                                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
                            })()}`}>
                                {/* Menu Columns */}
                                {availableMenus.map(([key, menu]) => (
                                    <div key={key}>
                                        {renderMenuColumn(menu as MenuItem[], menuTitles[key as keyof typeof menuTitles] || 'Menu')}
                                    </div>
                                ))}
                            </div>
                            <div className={'grid gap-12 mt-12'}>
                                {/* Contact Column */}
                                {hasContact && renderContactSection()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Bar */}
            {(copyright || siteCredit) && (
                <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5" />
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            {copyright && (
                                <p className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300">
                                    {copyright}
                                </p>
                            )}
                            {siteCredit && (
                                <p className="text-sm text-gray-500 hover:text-gray-400 transition-colors duration-300 group cursor-pointer">
                                    <span className="relative">
                                        {siteCredit}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Footer;