import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';

import Header from './Header/Header';
import Body from './Body/Body';
import ContactListForm from './ContactForm/ContactForm';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';

import { INITIAL_STATE_APP } from '../helpers/constants';
import ThemeContext, { themeConfig } from '../contex/ThemeContext';
import { v4 as uuidv4 } from 'uuid';

import fadeTransition from './transitions/fade.module.css';

class App extends Component {
  state = {
    ...INITIAL_STATE_APP,
  };

  componentDidMount() {
    const localStoregeContacts = localStorage.getItem('contacts');

    if (localStoregeContacts) {
      this.setState({
        contacts: JSON.parse(localStoregeContacts),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  addContacts = ({ name, number }) => {
    const contacts = {
      id: uuidv4(),
      name,
      number,
    };
    const overlap = this.state.contacts.some(
      contacts => contacts.name === name,
    );

    if (!overlap) {
      this.setState(prevState => {
        return {
          contacts: [...prevState.contacts, contacts],
        };
      });
    } else alert(`${name} is already in contacts`);
  };

  removeContacts = id => {
    this.setState(prevState => {
      return {
        contacts: prevState.contacts.filter(contact => contact.id !== id),
      };
    });
  };

  changeFilter = ({ target }) => {
    const filter = target.value;
    this.setState({ filter });
  };

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(contact => {
      return contact.name.toLowerCase().includes(filter.toLowerCase());
    });
  };

  toggleTheme = () => {
    const { theme } = this.state;
    this.setState({
      theme: theme === 'dark' ? 'light' : 'dark',
    });
  };

  render() {
    const { theme, filter, contacts } = this.state;
    const visibleContacts = this.getVisibleContacts();
    const showContacts = contacts.length;

    return (
      <ThemeContext.Provider
        value={{
          type: theme,
          config: themeConfig[theme],
        }}
      >
        <Header toggleTheme={this.toggleTheme} />
        <Body>
          <ContactListForm onAddContacts={this.addContacts} />
          {showContacts > 1 && (
            <Filter value={filter} onChange={this.changeFilter} />
          )}

          <CSSTransition
            in={showContacts > 0}
            timeout={250}
            classNames={fadeTransition}
            unmountOnExit
          >
            <ContactList
              contacts={visibleContacts}
              onRemove={this.removeContacts}
            />
          </CSSTransition>
        </Body>
      </ThemeContext.Provider>
    );
  }
}

export default App;
