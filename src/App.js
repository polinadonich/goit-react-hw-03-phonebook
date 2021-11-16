import { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import contacts from "./components/contacts.json";
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import Filter from './components/Filter';
import s from './components/Phonebook.module.css';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    //  console.log(parsedContacts)
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, PrevState) {
    if (this.state.contacts !== PrevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  addContact = ({ name, number }) => {
    if (this.state.contacts.some(contact => contact.name.includes(name))) {
      alert(`контакт ${name} уже существует`);
      return;
    }
    const contact = {
      id: uuidv4(),
      name,
      number,
    };

    this.setState(prevState => ({
      contacts: [contact, ...prevState.contacts],
    }));
  };

  changeFilter = e => {
    console.log(e.currentTarget.value);
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleContact = () => {
    const { filter, contacts } = this.state;
    // console.log(contacts);
    const normalizeTodo = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeTodo),
    );
  };

  deleteContact = todoId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== todoId),
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
    const { name, number } = this.state;
    const isContactsIncludes = this.props.contacts.find(
      contact => contact.name === name,
    );

    if (isContactsIncludes) {
      return alert(`${name}is alredy in contacts`);
    } else {
      this.props.addContact(name, number);

      this.setState({ name: '', number: '' });
    }
  };

  render() {
    const { filter } = this.state;
    const visibleContact = this.getVisibleContact();
    return (
      <div className={s.container}>
        <div className={s.phonebookContainer}>
          <h1>Phonebook</h1>
          <ContactForm addContact={this.addContact} />
        </div>

        <div className={s.contactsContainer}>
          <h2>Contacts</h2>
          <Filter value={filter} onChange={this.changeFilter} />
          <ContactList
            contacts={visibleContact}
            deleteContact={this.deleteContact}
          />
        </div>
      </div>
    );
  }
}

export default App;
