export class Person {
  static validate(person) {
    if (!person.name) {
      throw new Error("Name is required");
    }
    if (!person.cpf) {
      throw new Error("CPF is required");
    }
  }

  static format(person) {
    const [firstName, ...lastName] = person.name.split(" ");

    return {
      cpf: person.cpf.replace(/\D/g, ""), // removes non-digit characters
      firstName,
      lastName: lastName.join(" "),
    };
  }

  static save(person) {
    if (!["cpf", "firstName", "lastName"].every((prop) => person[prop])) {
      throw new Error("Person is invalid");
    }
  }

  static process(person) {
    this.validate(person);
    const formattedPerson = this.format(person);
    this.save(formattedPerson);

    return "ok";
  }
}
