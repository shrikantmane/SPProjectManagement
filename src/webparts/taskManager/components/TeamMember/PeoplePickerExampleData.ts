import { IPersonaProps, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
// import { TestImages } from '../../../../common/TestImages';

export const people: (IPersonaProps & { key: string | number })[] = [
  {
    key: 1,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'PV',
    text: 'Annie Lindqvist',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.online
  },
  {
    key: 2,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'AR',
    text: 'Aaron Reid',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.busy
  },
  {
    key: 3,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'AL',
    text: 'Alex Lundberg',
    secondaryText: 'Software Developer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.dnd
  },
  {
    key: 4,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'RK',
    text: 'Roko Kolar',
    secondaryText: 'Financial Analyst',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.offline
  },
  {
    key: 5,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'CB',
    text: 'Christian Bergqvist',
    secondaryText: 'Sr. Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.online
  },
  {
    key: 6,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'VL',
    text: 'Valentina Lovric',
    secondaryText: 'Design Developer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.online
  },
  {
    key: 7,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'MS',
    text: 'Maor Sharett',
    secondaryText: 'UX Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.away
  },
  {
    key: 8,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'PV',
    text: 'Anny Lindqvist',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.busy
  },
  {
    key: 9,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'AR',
    text: 'Aron Reid',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.dnd
  },
  {
    key: 10,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Gray_-_replace_this_image_female.svg/2000px-Gray_-_replace_this_image_female.svg.png',
    imageInitials: 'AL',
    text: 'Alix Lundberg',
    secondaryText: 'Software Developer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.offline
  },
];

export const mru: IPersonaProps[] = people.slice(0, 5);










