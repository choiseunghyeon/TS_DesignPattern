class Singleton {
  private static _default: Singleton;

  static get default(): Singleton {
    if (Singleton._default) {
      return Singleton._default;
    } else {
      let singleton = new Singleton();
      Singleton._default = singleton;
      return singleton;
    }
  }
}
