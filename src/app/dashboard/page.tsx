/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Calendar,
  LogOut,
  Mail,
  Menu,
  X,
  Heart,
  User,
  BookOpen,
  Download,
  House,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardSkeleton } from '@/components/skeleton';
import LeadsView from '@/components/Leads/LeadsView';
import NewsletterView from '@/components/Newsletter/NewsletterView';
import DashboardView from '@/components/DashboardView/DashboardView';
import AppointmentsDashboard from '@/components/AppointmentsDashboard/AppointmentsDashboard';
import BlogView from '@/components/Blog/BlogView';
import DashboardNotifications from '@/components/DashboardNotifications/DashboardNotifications';
import NotificationsView from '@/components/NotificationsView/NotificationsView';
import CRMView from '@/components/CRM/CRMView';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [activeView, setActiveView] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [localReadNotifications, setLocalReadNotifications] = useState<
    Set<string>
  >(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Load saved active view and sidebar state from localStorage on component mount
  useEffect(() => {
    try {
      const savedView = localStorage.getItem('dashboardActiveView');
      if (savedView) {
        setActiveView(savedView);
      }
      const savedSidebarState = localStorage.getItem('sidebarCollapsed');
      if (savedSidebarState) {
        setIsSidebarCollapsed(JSON.parse(savedSidebarState));
      }
    } catch (error) {
      console.error('Error loading saved state from localStorage:', error);
    }
  }, []);

  // Save active view and sidebar state to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('dashboardActiveView', activeView);
    } catch (error) {
      console.error('Error saving view to localStorage:', error);
    }
  }, [activeView]);

  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    } catch (error) {
      console.error('Error saving sidebar state to localStorage:', error);
    }
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.push('/login');
      }
    };
    getUser();
  }, [supabase, router]);

  // Close mobile menu when clicking outside or on a menu item
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load read notifications from localStorage on component mount
  useEffect(() => {
    try {
      const savedReadNotifications = localStorage.getItem('readNotifications');
      if (savedReadNotifications) {
        setLocalReadNotifications(new Set(JSON.parse(savedReadNotifications)));
      }
    } catch (error) {
      console.error(
        'Error loading read notifications from localStorage:',
        error
      );
    }
  }, []);

  // Save read notifications to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        'readNotifications',
        JSON.stringify([...localReadNotifications])
      );
    } catch (error) {
      console.error('Error saving read notifications to localStorage:', error);
    }
  }, [localReadNotifications]);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/dashboard/notifications?limit=1');
        const data = await response.json();
        if (response.ok) {
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      // Update unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Fetch notifications - moved from DashboardNotifications component
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       // Get recent notifications from the notifications table
  //       const sevenDaysAgo = new Date();
  //       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  //       // Fetch from notifications table if it exists
  //       const { data: notificationData, error: notificationError } = await supabase
  //         .from('notifications')
  //         .select('*')
  //         .gte('created_at', sevenDaysAgo.toISOString())
  //         .order('created_at', { ascending: false })
  //         .limit(50);

  //       let notificationList: any[] = [];

  //       // If notifications table exists and has data, use it
  //       if (!notificationError && notificationData && notificationData.length > 0) {
  //         notificationList = notificationData.map(notification => ({
  //           id: notification.id,
  //           type: notification.type,
  //           title: notification.title,
  //           message: notification.message,
  //           timestamp: new Date(notification.created_at),
  //           timeAgo: getTimeAgo(new Date(notification.created_at)),
  //           data: {
  //             contact_id: notification.contact_id,
  //             contact_name: notification.contact_name,
  //             contact_email: notification.contact_email,
  //             reminder_number: notification.reminder_number
  //           },
  //           read: notification.read || localReadNotifications.has(notification.id)
  //         }));
  //       }

  //       // Also get recent contact submissions for backward compatibility
  //       const { data: contacts, error: contactsError } = await supabase
  //         .from('contacts')
  //         .select('*')
  //         .eq('archived', false)
  //         .gte('created_at', sevenDaysAgo.toISOString())
  //         .order('created_at', { ascending: false })
  //         .limit(50);

  //       if (!contactsError && contacts) {
  //         // Process contacts for various notification types
  //         contacts.forEach(contact => {
  //           const createdAt = new Date(contact.created_at);
  //           const timeAgo = getTimeAgo(createdAt);

  //           // Contact form submission
  //           const contactNotificationId = `contact-${contact.id}`;
  //           notificationList.push({
  //             id: contactNotificationId,
  //             type: 'contact',
  //             title: 'New Contact Submission',
  //             message: `${contact.name} submitted the contact form`,
  //             timestamp: createdAt,
  //             timeAgo,
  //             data: contact,
  //             read: localReadNotifications.has(contactNotificationId)
  //           });

  //           // Questionnaire completion
  //           if (contact.questionnaire_completed && contact.questionnaire_completed_at) {
  //             const questionnaireNotificationId = `questionnaire-${contact.id}`;
  //             notificationList.push({
  //               id: questionnaireNotificationId,
  //               type: 'questionnaire',
  //               title: 'Questionnaire Completed',
  //               message: `${contact.name} completed their questionnaire`,
  //               timestamp: new Date(contact.questionnaire_completed_at),
  //               timeAgo: getTimeAgo(new Date(contact.questionnaire_completed_at)),
  //               data: contact,
  //               read: localReadNotifications.has(questionnaireNotificationId)
  //             });
  //           }

  //           // Appointment scheduled
  //           if (contact.scheduled_appointment_at) {
  //             const appointmentNotificationId = `appointment-${contact.id}`;
  //             notificationList.push({
  //               id: appointmentNotificationId,
  //               type: 'appointment',
  //               title: 'Appointment Scheduled',
  //               message: `${contact.name} scheduled a consultation`,
  //               timestamp: new Date(contact.scheduled_appointment_at),
  //               timeAgo: getTimeAgo(new Date(contact.scheduled_appointment_at)),
  //               data: contact,
  //               read: localReadNotifications.has(appointmentNotificationId)
  //             });
  //           }

  //           // Legacy auto-reminder handling (only if no notifications table data exists)
  //           if (notificationData?.length === 0 && contact.last_auto_reminder_sent) {
  //             const reminderNotificationId = `reminder-${contact.id}-${contact.auto_reminder_count || 1}`;
  //             notificationList.push({
  //               id: reminderNotificationId,
  //               type: 'reminder_sent',
  //               title: 'Auto-Reminder Sent',
  //               message: `Reminder #${contact.auto_reminder_count || 1} sent to ${contact.name}`,
  //               timestamp: new Date(contact.last_auto_reminder_sent),
  //               timeAgo: getTimeAgo(new Date(contact.last_auto_reminder_sent)),
  //               data: contact,
  //               read: localReadNotifications.has(reminderNotificationId)
  //             });
  //           }
  //         });
  //       }

  //       // Remove duplicates and sort by timestamp (newest first)
  //       const uniqueNotifications = notificationList.filter((notification, index, self) =>
  //         index === self.findIndex(n => n.id === notification.id)
  //       );

  //       uniqueNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  //       setNotifications(uniqueNotifications);
  //       setUnreadCount(uniqueNotifications.filter(n => !n.read).length);

  //     } catch (error) {
  //       console.error('Error fetching notifications:', error);
  //     }
  //   };

  //   if (user) {
  //     fetchNotifications();
  //     // Refresh notifications every 2 minutes to catch auto-reminders faster
  //     const interval = setInterval(fetchNotifications, 2 * 60 * 1000);
  //     return () => clearInterval(interval);
  //   }
  // }, [user, supabase, localReadNotifications]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNotificationClick = (notification: any) => {
    // Navigate to relevant section based on notification type
    if (
      notification.type === 'contact' ||
      notification.type === 'questionnaire'
    ) {
      setActiveView('Leads');
    } else if (notification.type === 'appointment' || notification.type === 'appointment_scheduled') {
      setActiveView('Appointments');
    } else if (
      notification.type === 'reminder_sent' ||
      notification.type === 'reminder'
    ) {
      setActiveView('Leads'); // View the leads to see reminder status
    }

    // Close notification dropdown and mobile menu
    setIsNotificationOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleMenuItemClick = (viewName: string) => {
    setActiveView(viewName);
    setIsMobileMenuOpen(false); // Close mobile menu when item is selected

    // Reset unread count when navigating to notifications
    if (viewName === 'Notifications') {
      setUnreadCount(0);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'Notifications':
        return <NotificationsView />;
      case 'Newsletter':
        return <NewsletterView />;
      case 'Blogs':
        return <BlogView />;
      case 'Leads':
        return <LeadsView />;
      case 'Appointments':
        return <AppointmentsDashboard />;
      case 'CRM':
        return <CRMView />;
      case 'Dashboard':
      default:
        return <DashboardView />;
    }
  };

  if (!user) {
    return <DashboardSkeleton />;
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Notifications', icon: Bell },
    { name: 'Newsletter', icon: Mail },
    { name: 'Blogs', icon: Newspaper },
    { name: 'Leads', icon: Users },
    { name: 'Appointments', icon: Calendar },
    { name: 'CRM', icon: MessageCircle },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'h-full' : ''} flex flex-col`}>
      <div className={`flex items-center mb-10 ${!isMobile && isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`font-bold text-2xl ${!isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>
          Admin Panel
        </div>
        {/* Collapse button for desktop only */}
        {!isMobile && (
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      <nav className="flex-grow">
        <ul>
          {menuItems.map(item => (
            <li key={item.name} className="mb-2">
              <button
                onClick={() => handleMenuItemClick(item.name)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                  activeView === item.name
                    ? 'bg-tst-purple text-black'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <item.icon className="h-5 w-5" />
                  {item.name === 'Notifications' && unreadCount > 0 && (
                    <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium ${
                      !isMobile && isSidebarCollapsed ? 'h-4 w-4' : 'h-4 w-4'
                    }`}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className={`${!isMobile && isSidebarCollapsed ? 'hidden' : 'ml-3'}`}>
                  {item.name}
                  {item.name === 'Notifications' && unreadCount > 0 && !isSidebarCollapsed && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 font-medium">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className={`my-6 border-t border-gray-200 ${!isMobile && isSidebarCollapsed ? 'hidden' : ''}`}></div>

        {/* Main Site Navigation */}
        <div className={`mb-4 ${!isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Main Site
          </h3>
          <ul>
            <li className="mb-2">
              <Link
                href="/"
                className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 text-left"
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <House className={`h-5 w-5 flex-shrink-0 ${!isMobile && isSidebarCollapsed ? '' : 'mr-3'}`} />
                <span className={`${!isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>
                  Home
                </span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/therapy-services"
                className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 text-left"
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <Heart className={`h-5 w-5 flex-shrink-0 ${!isMobile && isSidebarCollapsed ? '' : 'mr-3'}`} />
                <span className={`${!isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>
                  Therapy Services
                </span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/about"
                className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 text-left"
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <User className={`h-5 w-5 flex-shrink-0 ${!isMobile && isSidebarCollapsed ? '' : 'mr-3'}`} />
                <span className={`${!isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>
                  About
                </span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/mental-health-healing-blog"
                className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 text-left"
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <BookOpen className={`h-5 w-5 flex-shrink-0 ${!isMobile && isSidebarCollapsed ? '' : 'mr-3'}`} />
                <span className={`${!isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>
                  Toasted Insights Blog
                </span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/guides"
                className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 text-left"
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <Download className={`h-5 w-5 flex-shrink-0 ${!isMobile && isSidebarCollapsed ? '' : 'mr-3'}`} />
                <span className={`${!isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>
                  Free Guides
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className={`${isMobile ? 'mt-auto' : ''}`}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 text-left"
        >
          <LogOut className={`h-5 w-5 text-red-500 flex-shrink-0 ${!isMobile && isSidebarCollapsed ? '' : 'mr-3'}`} />
          <span className={`text-red-500 ${!isMobile && isSidebarCollapsed ? 'hidden' : ''}`}>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 border-2 border-black relative">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b-2 border-black p-4 flex items-center justify-between z-50">
        <Image
          src="https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/logo/TST-LOGO-WHITE.svg"
          alt="TST logo"
          width={75}
          height={10}
        />
        <div className="flex items-center space-x-2">
          {/* Mobile Notification Bell - Single Instance */}
          <div className="md:hidden">
            <DashboardNotifications
              user={user}
              onNotificationClick={handleNotificationClick}
            />
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {(isMobileMenuOpen || isNotificationOpen) && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-shrink-0 bg-white border-r p-4 flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white border-r p-4 transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent isMobile={true} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Add top padding on mobile to account for fixed header */}
        <div className="p-4 md:p-10 pt-20 md:pt-10">{renderView()}</div>
      </main>
    </div>
  );
};

export default DashboardPage;
