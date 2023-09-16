import BaseComponent from '@utils/baseComponent';

export default function createTeamMemberCard(
  name: string,
  role: string,
  gitHubLink: string,
  bio: string,
  photoLink: string,
  contributionsArr: string[],
): BaseComponent<'div'> {
  const teamMemberContainer = new BaseComponent({
    tagName: 'div',
    classNames: ['card', 'bg-base-100', 'shadow-xl', 'card-team-member'],
  });
  const cardBody = new BaseComponent({ tagName: 'div', classNames: ['card-body'] });
  const photoContainer = createAvatar(photoLink);
  const nameElem = new BaseComponent({ tagName: 'p', textContent: name, classNames: ['card-title', 'card-tm-name'] });
  const bioElem = new BaseComponent({ tagName: 'p', textContent: bio, classNames: ['card-team-member-bio'] });
  const roleElem = new BaseComponent({ tagName: 'p', classNames: ['card-team-member-subtitle'] });
  roleElem.getNode().innerHTML = role;
  const gitHubLinkElem = new BaseComponent({
    tagName: 'a',
    attributes: { href: gitHubLink, target: '_blank' },
    classNames: ['btn', 'btn-base-101', 'btn-tm-github', 'rounded-full'],
  });
  const contributionsBlock = new BaseComponent({
    tagName: 'ul',
    classNames: ['contributions-list'],
  });
  contributionsArr.forEach((elem) => {
    const contrinutionElem = new BaseComponent({
      tagName: 'li',
      classNames: ['contribution-item'],
      textContent: elem,
    });
    contributionsBlock.append(contrinutionElem);
  });

  cardBody.appendChildren([photoContainer, nameElem, roleElem, bioElem, contributionsBlock, gitHubLinkElem]);
  teamMemberContainer.append(cardBody);
  return teamMemberContainer;
}

function createAvatar(photoLink: string): BaseComponent<'div'> {
  const photoContainer = new BaseComponent({
    tagName: 'div',
    classNames: ['avatar'],
  });
  const photoElem = new BaseComponent({
    tagName: 'div',
    classNames: ['w-20', 'rounded-full'],
  });
  const photo = new BaseComponent({
    tagName: 'img',
    classNames: [photoLink],
  });
  photoElem.append(photo);
  photoContainer.append(photoElem);

  return photoContainer;
}
