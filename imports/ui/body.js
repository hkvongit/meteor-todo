import { Template } from "meteor/templating";
import { Tasks } from "../api/tasks";
import { ReactiveDict } from "meteor/reactive-dict";
import "../startup/accounts-config";
import "./body.html";

Template.body.helpers({
  tasksFunction() {
    console.dir(Tasks.find({}).fetch())
    if (Meteor.user()) {
      if (Template.instance().state.get("hideCompleted")) {
        return Tasks.find(
          { username: Meteor.user().username,checked: { $ne: true } },
          { sort: { createdAt: -1 } }
        );
      } else {
        
        return Tasks.find(
          { username: Meteor.user().username },
          { sort: { createdAt: -1 } }
        );
      }
    } else {
      return null;
    }
  }
});

// onCreated is used to generate the temporary state once the data is been fined creation in the template
Template.body.onCreated(function bodyOnCreated() {
  // creating a new instance of ReactiveDict which is a temporary state
  this.state = new ReactiveDict();
});

Template.body.events({
  "submit .new-task"(event) {
    event.preventDefault();
    const text = event.target.text.value;
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
    event.target.text.value = "";
  },
  "change .hide-finished"(event, instance) {
    // creating a new ReactiveaDict state name of hideCompleted having a set Value : event.target.checked
    instance.state.set("hideCompleted", event.target.checked);
  }
});

Template.individualTask.events({
  "click .toggle-checked"() {
    // Set the checked property to the opposite of its current value

    Tasks.update(this._id, {
      $set: { checked: !this.checked }
    });
  },
  "click .delete"() {
    Tasks.remove(this._id);
  }
});
