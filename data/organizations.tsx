import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Announcement {
  title: string;
  body: string;
  date: Date;
}

export interface Submission {
  name: string;
  uri: string;
}

export interface Assignment {
  title: string;
  body: string;
  date: Date;
  due: Date;
  submissions: Submission[];
  submitted: boolean;
  submittedAt: Date | null;
}

export interface Subject {
  name: string;
  teacher: string;
  icon: string;
  theme: 'blue' | 'green' | 'yellow' | 'purple';
  announcements: Announcement[];
  assignments: Assignment[];
}

export interface Class {
  name: string;
  teacher: string;
  subjects: Subject[];
}

export interface Organization {
  name: string;
  classes: Class[];
}

export const useOrganizations = create(
  persist<{
    organizations: Organization[];
    activeOrganization: string;
    setActiveOrganization: (organization: string) => void;
    addOrganization: (organization: string) => void;
    addClass: (organization: string, class_: Class) => void;
    addSubject: (
      organization: string,
      class_: string,
      subject: Subject
    ) => void;
    addAnnouncement: (
      organization: string,
      class_: string,
      subject: string,
      announcement: Announcement
    ) => void;
    addAssignment: (
      organization: string,
      class_: string,
      subject: string,
      assignment: Assignment
    ) => void;
    addSubmission: (
      organization: string,
      class_: string,
      subject: string,
      assignment: string,
      submission: Submission
    ) => void;
    setSubmitted: (
      organization: string,
      class_: string,
      subject: string,
      assignment: string
    ) => void;
    deleteOrganization: (organization: string) => void;
    getOrganization: (organization: string) => Organization;
    getSubject: (
      organization: string,
      class_: string,
      subject: string
    ) => Subject;
  }>(
    (set, get) => ({
      organizations: [],
      activeOrganization: '',
      setActiveOrganization: (organization) =>
        set({ activeOrganization: organization }),
      addOrganization: (organization) =>
        set((state) => ({
          organizations: [
            ...state.organizations,
            { name: organization, classes: [] }
          ]
        })),
      addClass: (organization, class_) =>
        set((state) => {
          const organizations = state.organizations.map((org) => {
            if (org.name === organization) {
              return { ...org, classes: [...org.classes, class_] };
            }
            return org;
          });
          return { organizations };
        }),
      addSubject: (organization, class_, subject) =>
        set((state) => {
          const organizations = state.organizations.map((org) => {
            if (org.name === organization) {
              const classes = org.classes.map((cls) => {
                if (cls.name === class_) {
                  return { ...cls, subjects: [...cls.subjects, subject] };
                }
                return cls;
              });
              return { ...org, classes };
            }
            return org;
          });
          return { organizations };
        }),
      addAnnouncement: (organization, class_, subject, announcement) =>
        set((state) => {
          const organizations = state.organizations.map((org) => {
            if (org.name === organization) {
              const classes = org.classes.map((cls) => {
                if (cls.name === class_) {
                  const subjects = cls.subjects.map((sub) => {
                    if (sub.name === subject) {
                      return {
                        ...sub,
                        announcements: [...sub.announcements, announcement]
                      };
                    }
                    return sub;
                  });
                  return { ...cls, subjects };
                }
                return cls;
              });
              return { ...org, classes };
            }
            return org;
          });
          return { organizations };
        }),
      addAssignment: (organization, class_, subject, assignment) =>
        set((state) => {
          const organizations = state.organizations.map((org) => {
            if (org.name === organization) {
              const classes = org.classes.map((cls) => {
                if (cls.name === class_) {
                  const subjects = cls.subjects.map((sub) => {
                    if (sub.name === subject) {
                      return {
                        ...sub,
                        assignments: [...sub.assignments, assignment]
                      };
                    }
                    return sub;
                  });
                  return { ...cls, subjects };
                }
                return cls;
              });
              return { ...org, classes };
            }
            return org;
          });
          return { organizations };
        }),
      addSubmission: (organization, class_, subject, assignment, submission) =>
        set((state) => {
          const organizations = state.organizations.map((org) => {
            if (org.name === organization) {
              const classes = org.classes.map((cls) => {
                if (cls.name === class_) {
                  const subjects = cls.subjects.map((sub) => {
                    if (sub.name === subject) {
                      const assignments = sub.assignments.map((assignment_) => {
                        if (assignment_.title === assignment) {
                          return {
                            ...assignment_,
                            submissions: [
                              ...assignment_.submissions,
                              submission
                            ]
                          };
                        }
                        return assignment_;
                      });
                      return { ...sub, assignments };
                    }
                    return sub;
                  });
                  return { ...cls, subjects };
                }
                return cls;
              });
              return { ...org, classes };
            }
            return org;
          });
          return { organizations };
        }),
      setSubmitted: (organization, class_, subject, assignment) =>
        set((state) => {
          const organizations = state.organizations.map((org) => {
            if (org.name === organization) {
              const classes = org.classes.map((cls) => {
                if (cls.name === class_) {
                  const subjects = cls.subjects.map((sub) => {
                    if (sub.name === subject) {
                      const assignments = sub.assignments.map((assignment_) => {
                        if (assignment_.title === assignment) {
                          return {
                            ...assignment_,
                            submitted: true,
                            submittedAt: new Date()
                          };
                        }
                        return assignment_;
                      });
                      return { ...sub, assignments };
                    }
                    return sub;
                  });
                  return { ...cls, subjects };
                }
                return cls;
              });
              return { ...org, classes };
            }
            return org;
          });
          return { organizations };
        }),
      deleteOrganization: (organization) =>
        set((state) => ({
          organizations: state.organizations.filter(
            (org) => org.name !== organization
          )
        })),
      getOrganization: (organization) =>
        get().organizations.find((org) => org.name === organization) || {
          name: '',
          classes: []
        },
      getSubject: (organization, class_, subject) => {
        const org = get().organizations.find(
          (org) => org.name === organization
        );
        if (!org) {
          return {
            name: '',
            teacher: '',
            icon: '',
            theme: 'blue',
            announcements: [],
            assignments: []
          };
        }
        const cls = org.classes.find((cls) => cls.name === class_);
        if (!cls) {
          return {
            name: '',
            teacher: '',
            icon: '',
            theme: 'blue',
            announcements: [],
            assignments: []
          };
        }
        const sub = cls.subjects.find((sub) => sub.name === subject);
        if (!sub) {
          return {
            name: '',
            teacher: '',
            icon: '',
            theme: 'blue',
            announcements: [],
            assignments: []
          };
        }
        return sub;
      }
    }),
    {
      name: 'organizations',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
