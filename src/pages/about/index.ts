import Page from '@utils/pageTemplate';
import BaseComponent from '@utils/baseComponent';
import { teamMembers, collaborationInfo } from './teamMembersDescription';
import createTeamMemberCard from './teamMemberCard';
import { aboutRSS } from './aboutRSS';
import './style.css';

export default class About extends Page {
  constructor() {
    super('about');
  }

  private collaborationInfoContainer = new BaseComponent({
    tagName: 'div',
    classNames: ['collaboration-info'],
    textContent: collaborationInfo,
  });

  private cardsContainer = new BaseComponent({
    tagName: 'div',
    classNames: ['cards-container'],
  });

  private createAboutRSSContainer(): BaseComponent<'div'> {
    const aboutRSSContainer = new BaseComponent({
      tagName: 'div',
      classNames: ['about-rss'],
    });
    aboutRSSContainer.getNode().innerHTML = aboutRSS;
    return aboutRSSContainer;
  }

  private createTeamMemberCards(): BaseComponent<'div'> {
    teamMembers.forEach((elem) => {
      const card = createTeamMemberCard(
        elem.name,
        elem.role,
        elem.gitHubLink,
        elem.bio,
        elem.photo,
        elem.contributions,
      );
      this.cardsContainer.append(card);
    });
    return this.cardsContainer;
  }

  public render(): HTMLElement {
    this.container.append(this.createHeaderTitle('About us'));
    this.container.append(this.collaborationInfoContainer.getNode());
    this.createTeamMemberCards();
    this.container.append(this.cardsContainer.getNode());
    this.container.append(this.createAboutRSSContainer().getNode());
    return this.container;
  }
}
